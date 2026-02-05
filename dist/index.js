#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { CoolifyClient } from './coolify-client.js';
// Parse command line arguments
// Usage: node dist/index.js --url <COOLIFY_URL> --token <API_TOKEN>
// Or: node dist/index.js <COOLIFY_URL> <API_TOKEN>
function parseArgs() {
    const args = process.argv.slice(2);
    let apiUrl;
    let apiToken;
    // Check for named arguments
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--url' && args[i + 1]) {
            apiUrl = args[i + 1];
            i++;
        }
        else if (args[i] === '--token' && args[i + 1]) {
            apiToken = args[i + 1];
            i++;
        }
    }
    // Fallback to positional arguments
    if (!apiUrl && !apiToken && args.length >= 2) {
        apiUrl = args[0];
        apiToken = args[1];
    }
    // Fallback to environment variables
    apiUrl = apiUrl || process.env.COOLIFY_API_URL;
    apiToken = apiToken || process.env.COOLIFY_API_TOKEN;
    if (!apiUrl || !apiToken) {
        console.error('Usage: coolify-mcp --url <COOLIFY_URL> --token <API_TOKEN>');
        console.error('   Or: coolify-mcp <COOLIFY_URL> <API_TOKEN>');
        console.error('   Or set COOLIFY_API_URL and COOLIFY_API_TOKEN environment variables');
        process.exit(1);
    }
    return { apiUrl, apiToken };
}
const { apiUrl, apiToken } = parseArgs();
// Initialize Coolify client
const coolify = new CoolifyClient({
    apiUrl,
    apiToken,
});
// Define all tools
const tools = [
    // Health Check
    {
        name: 'healthcheck',
        description: 'Check if Coolify API is healthy and accessible',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    // Teams
    {
        name: 'list_teams',
        description: 'List all teams you have access to',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_current_team',
        description: 'Get the current team information',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    // Projects
    {
        name: 'list_projects',
        description: 'List all projects in Coolify',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_project',
        description: 'Get detailed information about a specific project',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the project',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'create_project',
        description: 'Create a new project in Coolify',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The name of the project',
                },
                description: {
                    type: 'string',
                    description: 'The description of the project',
                },
            },
            required: ['name'],
        },
    },
    {
        name: 'update_project',
        description: 'Update an existing project',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the project',
                },
                name: {
                    type: 'string',
                    description: 'The new name of the project',
                },
                description: {
                    type: 'string',
                    description: 'The new description of the project',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'delete_project',
        description: 'Delete a project',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the project to delete',
                },
            },
            required: ['uuid'],
        },
    },
    // Servers
    {
        name: 'list_servers',
        description: 'List all servers connected to Coolify',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_server',
        description: 'Get detailed information about a specific server',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the server',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'get_server_resources',
        description: 'Get resources (applications, databases, services) running on a server',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the server',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'get_server_domains',
        description: 'Get all domains configured on a server',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the server',
                },
            },
            required: ['uuid'],
        },
    },
    // Applications
    {
        name: 'list_applications',
        description: 'List all applications deployed in Coolify',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_application',
        description: 'Get detailed information about a specific application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'update_application',
        description: 'Update application settings including general, build, network, healthcheck, resource limits, and webhooks',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
                // General
                name: {
                    type: 'string',
                    description: 'Application name',
                },
                description: {
                    type: 'string',
                    description: 'Application description',
                },
                domains: {
                    type: 'string',
                    description: 'Comma-separated list of domains (FQDN)',
                },
                // Build settings
                build_pack: {
                    type: 'string',
                    enum: ['nixpacks', 'static', 'dockerfile', 'dockercompose'],
                    description: 'Build pack type',
                },
                base_directory: {
                    type: 'string',
                    description: 'Base directory for all commands',
                },
                publish_directory: {
                    type: 'string',
                    description: 'Publish directory',
                },
                dockerfile_location: {
                    type: 'string',
                    description: 'Dockerfile location',
                },
                watch_paths: {
                    type: 'string',
                    description: 'Watch paths for auto-deploy',
                },
                // Commands
                install_command: {
                    type: 'string',
                    description: 'Install command',
                },
                build_command: {
                    type: 'string',
                    description: 'Build command',
                },
                start_command: {
                    type: 'string',
                    description: 'Start command',
                },
                pre_deployment_command: {
                    type: 'string',
                    description: 'Pre-deployment command',
                },
                post_deployment_command: {
                    type: 'string',
                    description: 'Post-deployment command',
                },
                // Network
                ports_exposes: {
                    type: 'string',
                    description: 'Ports to expose (e.g., "3000,8080")',
                },
                ports_mappings: {
                    type: 'string',
                    description: 'Port mappings (e.g., "3000:3000")',
                },
                redirect: {
                    type: 'string',
                    enum: ['www', 'non-www', 'both'],
                    description: 'Redirect setting for www/non-www',
                },
                // Git Source
                git_repository: {
                    type: 'string',
                    description: 'Git repository URL',
                },
                git_branch: {
                    type: 'string',
                    description: 'Git branch',
                },
                git_commit_sha: {
                    type: 'string',
                    description: 'Specific git commit SHA',
                },
                // Advanced settings
                is_static: {
                    type: 'boolean',
                    description: 'Is this a static site',
                },
                is_spa: {
                    type: 'boolean',
                    description: 'Is this a single-page application',
                },
                is_auto_deploy_enabled: {
                    type: 'boolean',
                    description: 'Enable auto-deploy on git push',
                },
                is_force_https_enabled: {
                    type: 'boolean',
                    description: 'Force HTTPS',
                },
                use_build_server: {
                    type: 'boolean',
                    description: 'Use build server',
                },
                // HTTP Basic Auth
                is_http_basic_auth_enabled: {
                    type: 'boolean',
                    description: 'Enable HTTP Basic Authentication',
                },
                http_basic_auth_username: {
                    type: 'string',
                    description: 'HTTP Basic Auth username',
                },
                http_basic_auth_password: {
                    type: 'string',
                    description: 'HTTP Basic Auth password',
                },
                // Health Check
                health_check_enabled: {
                    type: 'boolean',
                    description: 'Enable health check',
                },
                health_check_path: {
                    type: 'string',
                    description: 'Health check path',
                },
                health_check_port: {
                    type: 'string',
                    description: 'Health check port',
                },
                health_check_interval: {
                    type: 'number',
                    description: 'Health check interval in seconds',
                },
                health_check_timeout: {
                    type: 'number',
                    description: 'Health check timeout in seconds',
                },
                health_check_retries: {
                    type: 'number',
                    description: 'Health check retries count',
                },
                health_check_start_period: {
                    type: 'number',
                    description: 'Health check start period in seconds',
                },
                // Resource Limits
                limits_memory: {
                    type: 'string',
                    description: 'Memory limit (e.g., "512M", "1G")',
                },
                limits_memory_swap: {
                    type: 'string',
                    description: 'Memory swap limit',
                },
                limits_memory_reservation: {
                    type: 'string',
                    description: 'Memory reservation',
                },
                limits_cpus: {
                    type: 'string',
                    description: 'CPU limit (e.g., "0.5", "2")',
                },
                limits_cpu_shares: {
                    type: 'number',
                    description: 'CPU shares',
                },
                // Webhooks
                manual_webhook_secret_github: {
                    type: 'string',
                    description: 'GitHub webhook secret',
                },
                manual_webhook_secret_gitlab: {
                    type: 'string',
                    description: 'GitLab webhook secret',
                },
                manual_webhook_secret_bitbucket: {
                    type: 'string',
                    description: 'Bitbucket webhook secret',
                },
                manual_webhook_secret_gitea: {
                    type: 'string',
                    description: 'Gitea webhook secret',
                },
                // Labels
                custom_labels: {
                    type: 'string',
                    description: 'Custom Docker labels',
                },
                custom_docker_run_options: {
                    type: 'string',
                    description: 'Custom docker run options',
                },
                // Deploy options
                instant_deploy: {
                    type: 'boolean',
                    description: 'Deploy immediately after update',
                },
                connect_to_docker_network: {
                    type: 'boolean',
                    description: 'Connect to predefined Docker network',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'delete_application',
        description: 'Delete an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application to delete',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'start_application',
        description: 'Start an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application to start',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'stop_application',
        description: 'Stop an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application to stop',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'restart_application',
        description: 'Restart an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application to restart',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'deploy_application',
        description: 'Deploy/redeploy an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application to deploy',
                },
                force: {
                    type: 'boolean',
                    description: 'Force rebuild without cache',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'get_application_logs',
        description: 'Get logs from an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
                lines: {
                    type: 'number',
                    description: 'Number of log lines to retrieve (default: 100)',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'list_application_envs',
        description: 'List environment variables for an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'create_application_env',
        description: 'Create a new environment variable for an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
                key: {
                    type: 'string',
                    description: 'Environment variable key (name)',
                },
                value: {
                    type: 'string',
                    description: 'Environment variable value',
                },
                is_build_time: {
                    type: 'boolean',
                    description: 'Whether this is a build-time variable',
                },
                is_preview: {
                    type: 'boolean',
                    description: 'Whether this is for preview deployments',
                },
            },
            required: ['uuid', 'key', 'value'],
        },
    },
    {
        name: 'update_application_env',
        description: 'Update an existing environment variable for an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
                key: {
                    type: 'string',
                    description: 'Environment variable key (name)',
                },
                value: {
                    type: 'string',
                    description: 'New value for the environment variable',
                },
                is_build_time: {
                    type: 'boolean',
                    description: 'Whether this is a build-time variable',
                },
                is_preview: {
                    type: 'boolean',
                    description: 'Whether this is for preview deployments',
                },
            },
            required: ['uuid', 'key', 'value'],
        },
    },
    {
        name: 'delete_application_env',
        description: 'Delete an environment variable from an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
                env_uuid: {
                    type: 'string',
                    description: 'The UUID of the environment variable to delete',
                },
            },
            required: ['uuid', 'env_uuid'],
        },
    },
    // Application Persistent Storage
    {
        name: 'list_application_storages',
        description: 'List persistent storage volumes for an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'create_application_storage',
        description: 'Create a persistent storage volume for an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
                name: {
                    type: 'string',
                    description: 'Name of the storage volume',
                },
                mount_path: {
                    type: 'string',
                    description: 'Mount path inside the container (e.g., "/data")',
                },
                host_path: {
                    type: 'string',
                    description: 'Optional host path for the volume',
                },
            },
            required: ['uuid', 'name', 'mount_path'],
        },
    },
    {
        name: 'delete_application_storage',
        description: 'Delete a persistent storage volume from an application',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the application',
                },
                storage_uuid: {
                    type: 'string',
                    description: 'The UUID of the storage volume to delete',
                },
            },
            required: ['uuid', 'storage_uuid'],
        },
    },
    // Services
    {
        name: 'list_services',
        description: 'List all services (Docker Compose based) in Coolify',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_service',
        description: 'Get detailed information about a specific service',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the service',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'update_service',
        description: 'Update service settings',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the service',
                },
                name: {
                    type: 'string',
                    description: 'Service name',
                },
                description: {
                    type: 'string',
                    description: 'Service description',
                },
                docker_compose_raw: {
                    type: 'string',
                    description: 'Docker Compose YAML content',
                },
                instant_deploy: {
                    type: 'boolean',
                    description: 'Deploy immediately after update',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'delete_service',
        description: 'Delete a service',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the service to delete',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'start_service',
        description: 'Start a service',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the service to start',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'stop_service',
        description: 'Stop a service',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the service to stop',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'restart_service',
        description: 'Restart a service',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the service to restart',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'list_service_envs',
        description: 'List environment variables for a service',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the service',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'update_service_env',
        description: 'Update an environment variable for a service',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the service',
                },
                key: {
                    type: 'string',
                    description: 'Environment variable key (name)',
                },
                value: {
                    type: 'string',
                    description: 'Environment variable value',
                },
            },
            required: ['uuid', 'key', 'value'],
        },
    },
    // Databases
    {
        name: 'list_databases',
        description: 'List all databases in Coolify',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_database',
        description: 'Get detailed information about a specific database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'update_database',
        description: 'Update database settings including resource limits',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database',
                },
                name: {
                    type: 'string',
                    description: 'Database name',
                },
                description: {
                    type: 'string',
                    description: 'Database description',
                },
                image: {
                    type: 'string',
                    description: 'Docker image for the database',
                },
                is_public: {
                    type: 'boolean',
                    description: 'Make database publicly accessible',
                },
                public_port: {
                    type: 'number',
                    description: 'Public port number',
                },
                limits_memory: {
                    type: 'string',
                    description: 'Memory limit (e.g., "512M", "1G")',
                },
                limits_memory_swap: {
                    type: 'string',
                    description: 'Memory swap limit',
                },
                limits_memory_reservation: {
                    type: 'string',
                    description: 'Memory reservation',
                },
                limits_cpus: {
                    type: 'string',
                    description: 'CPU limit',
                },
                limits_cpu_shares: {
                    type: 'number',
                    description: 'CPU shares',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'delete_database',
        description: 'Delete a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database to delete',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'start_database',
        description: 'Start a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database to start',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'stop_database',
        description: 'Stop a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database to stop',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'restart_database',
        description: 'Restart a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database to restart',
                },
            },
            required: ['uuid'],
        },
    },
    // Database Backups
    {
        name: 'list_database_backups',
        description: 'List backup configurations for a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'create_database_backup',
        description: 'Create a new backup configuration for a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database',
                },
                enabled: {
                    type: 'boolean',
                    description: 'Enable the backup',
                },
                frequency: {
                    type: 'string',
                    description: 'Backup frequency (cron expression)',
                },
                save_s3: {
                    type: 'boolean',
                    description: 'Save backup to S3',
                },
                s3_storage_uuid: {
                    type: 'string',
                    description: 'S3 storage configuration UUID',
                },
                databases_to_backup: {
                    type: 'string',
                    description: 'Comma-separated list of databases to backup',
                },
                dump_all: {
                    type: 'boolean',
                    description: 'Dump all databases',
                },
            },
            required: ['uuid'],
        },
    },
    {
        name: 'update_database_backup',
        description: 'Update a backup configuration for a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database',
                },
                backup_uuid: {
                    type: 'string',
                    description: 'The UUID of the backup configuration',
                },
                enabled: {
                    type: 'boolean',
                    description: 'Enable the backup',
                },
                frequency: {
                    type: 'string',
                    description: 'Backup frequency (cron expression)',
                },
                save_s3: {
                    type: 'boolean',
                    description: 'Save backup to S3',
                },
                s3_storage_uuid: {
                    type: 'string',
                    description: 'S3 storage configuration UUID',
                },
                databases_to_backup: {
                    type: 'string',
                    description: 'Comma-separated list of databases to backup',
                },
                dump_all: {
                    type: 'boolean',
                    description: 'Dump all databases',
                },
                database_backup_retention_amount_locally: {
                    type: 'number',
                    description: 'Number of backups to retain locally',
                },
                database_backup_retention_days_locally: {
                    type: 'number',
                    description: 'Days to retain backups locally',
                },
                database_backup_retention_amount_s3: {
                    type: 'number',
                    description: 'Number of backups to retain in S3',
                },
                database_backup_retention_days_s3: {
                    type: 'number',
                    description: 'Days to retain backups in S3',
                },
            },
            required: ['uuid', 'backup_uuid'],
        },
    },
    {
        name: 'delete_database_backup',
        description: 'Delete a backup configuration from a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database',
                },
                backup_uuid: {
                    type: 'string',
                    description: 'The UUID of the backup configuration to delete',
                },
            },
            required: ['uuid', 'backup_uuid'],
        },
    },
    {
        name: 'trigger_database_backup',
        description: 'Trigger an immediate backup for a database',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the database',
                },
                backup_uuid: {
                    type: 'string',
                    description: 'The UUID of the backup configuration',
                },
            },
            required: ['uuid', 'backup_uuid'],
        },
    },
    // Deployments
    {
        name: 'list_deployments',
        description: 'List all deployments (recent deployment history)',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_deployment',
        description: 'Get detailed information about a specific deployment',
        inputSchema: {
            type: 'object',
            properties: {
                uuid: {
                    type: 'string',
                    description: 'The UUID of the deployment',
                },
            },
            required: ['uuid'],
        },
    },
];
// Create MCP server
const server = new Server({
    name: 'coolify-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        let result;
        switch (name) {
            // Health Check
            case 'healthcheck':
                result = await coolify.healthcheck();
                break;
            // Teams
            case 'list_teams':
                result = await coolify.listTeams();
                break;
            case 'get_current_team':
                result = await coolify.getCurrentTeam();
                break;
            // Projects
            case 'list_projects':
                result = await coolify.listProjects();
                break;
            case 'get_project':
                result = await coolify.getProject(args?.uuid);
                break;
            case 'create_project':
                result = await coolify.createProject({
                    name: args?.name,
                    description: args?.description,
                });
                break;
            case 'update_project':
                result = await coolify.updateProject(args?.uuid, {
                    name: args?.name,
                    description: args?.description,
                });
                break;
            case 'delete_project':
                result = await coolify.deleteProject(args?.uuid);
                break;
            // Servers
            case 'list_servers':
                result = await coolify.listServers();
                break;
            case 'get_server':
                result = await coolify.getServer(args?.uuid);
                break;
            case 'get_server_resources':
                result = await coolify.getServerResources(args?.uuid);
                break;
            case 'get_server_domains':
                result = await coolify.getServerDomains(args?.uuid);
                break;
            // Applications
            case 'list_applications':
                result = await coolify.listApplications();
                break;
            case 'get_application':
                result = await coolify.getApplication(args?.uuid);
                break;
            case 'update_application': {
                const { uuid, ...settings } = args;
                result = await coolify.updateApplication(uuid, settings);
                break;
            }
            case 'delete_application':
                result = await coolify.deleteApplication(args?.uuid);
                break;
            case 'start_application':
                result = await coolify.startApplication(args?.uuid);
                break;
            case 'stop_application':
                result = await coolify.stopApplication(args?.uuid);
                break;
            case 'restart_application':
                result = await coolify.restartApplication(args?.uuid);
                break;
            case 'deploy_application':
                result = await coolify.deployApplication(args?.uuid, args?.force);
                break;
            case 'get_application_logs':
                result = await coolify.getApplicationLogs(args?.uuid, args?.lines);
                break;
            case 'list_application_envs':
                result = await coolify.listApplicationEnvs(args?.uuid);
                break;
            case 'create_application_env':
                result = await coolify.createApplicationEnv(args?.uuid, {
                    key: args?.key,
                    value: args?.value,
                    is_build_time: args?.is_build_time,
                    is_preview: args?.is_preview,
                });
                break;
            case 'update_application_env':
                result = await coolify.updateApplicationEnv(args?.uuid, {
                    key: args?.key,
                    value: args?.value,
                    is_build_time: args?.is_build_time,
                    is_preview: args?.is_preview,
                });
                break;
            case 'delete_application_env':
                result = await coolify.deleteApplicationEnv(args?.uuid, args?.env_uuid);
                break;
            // Application Persistent Storage
            case 'list_application_storages':
                result = await coolify.listApplicationStorages(args?.uuid);
                break;
            case 'create_application_storage':
                result = await coolify.createApplicationStorage(args?.uuid, {
                    name: args?.name,
                    mount_path: args?.mount_path,
                    host_path: args?.host_path,
                });
                break;
            case 'delete_application_storage':
                result = await coolify.deleteApplicationStorage(args?.uuid, args?.storage_uuid);
                break;
            // Services
            case 'list_services':
                result = await coolify.listServices();
                break;
            case 'get_service':
                result = await coolify.getService(args?.uuid);
                break;
            case 'update_service': {
                const { uuid, ...settings } = args;
                result = await coolify.updateService(uuid, settings);
                break;
            }
            case 'delete_service':
                result = await coolify.deleteService(args?.uuid);
                break;
            case 'start_service':
                result = await coolify.startService(args?.uuid);
                break;
            case 'stop_service':
                result = await coolify.stopService(args?.uuid);
                break;
            case 'restart_service':
                result = await coolify.restartService(args?.uuid);
                break;
            case 'list_service_envs':
                result = await coolify.listServiceEnvs(args?.uuid);
                break;
            case 'update_service_env':
                result = await coolify.updateServiceEnv(args?.uuid, {
                    key: args?.key,
                    value: args?.value,
                });
                break;
            // Databases
            case 'list_databases':
                result = await coolify.listDatabases();
                break;
            case 'get_database':
                result = await coolify.getDatabase(args?.uuid);
                break;
            case 'update_database': {
                const { uuid, ...settings } = args;
                result = await coolify.updateDatabase(uuid, settings);
                break;
            }
            case 'delete_database':
                result = await coolify.deleteDatabase(args?.uuid);
                break;
            case 'start_database':
                result = await coolify.startDatabase(args?.uuid);
                break;
            case 'stop_database':
                result = await coolify.stopDatabase(args?.uuid);
                break;
            case 'restart_database':
                result = await coolify.restartDatabase(args?.uuid);
                break;
            // Database Backups
            case 'list_database_backups':
                result = await coolify.listDatabaseBackups(args?.uuid);
                break;
            case 'create_database_backup': {
                const { uuid, ...backupSettings } = args;
                result = await coolify.createDatabaseBackup(uuid, backupSettings);
                break;
            }
            case 'update_database_backup': {
                const { uuid, backup_uuid, ...backupSettings } = args;
                result = await coolify.updateDatabaseBackup(uuid, backup_uuid, backupSettings);
                break;
            }
            case 'delete_database_backup':
                result = await coolify.deleteDatabaseBackup(args?.uuid, args?.backup_uuid);
                break;
            case 'trigger_database_backup':
                result = await coolify.triggerDatabaseBackup(args?.uuid, args?.backup_uuid);
                break;
            // Deployments
            case 'list_deployments':
                result = await coolify.listDeployments();
                break;
            case 'get_deployment':
                result = await coolify.getDeployment(args?.uuid);
                break;
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Coolify MCP server started');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map