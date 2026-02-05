export interface CoolifyConfig {
    apiUrl: string;
    apiToken: string;
}
export interface Application {
    uuid: string;
    name: string;
    description?: string;
    fqdn?: string;
    status?: string;
    repository_project_id?: number;
    git_repository?: string;
    git_branch?: string;
    build_pack?: string;
    environment_id?: number;
    destination_id?: number;
    [key: string]: unknown;
}
export interface ApplicationSettings {
    name?: string;
    description?: string;
    domains?: string;
    build_pack?: 'nixpacks' | 'static' | 'dockerfile' | 'dockercompose';
    base_directory?: string;
    publish_directory?: string;
    dockerfile_location?: string;
    dockerfile?: string;
    dockerfile_target_build?: string;
    docker_compose_location?: string;
    docker_compose_custom_start_command?: string;
    docker_compose_custom_build_command?: string;
    watch_paths?: string;
    custom_docker_run_options?: string;
    install_command?: string;
    build_command?: string;
    start_command?: string;
    pre_deployment_command?: string;
    pre_deployment_command_container?: string;
    post_deployment_command?: string;
    post_deployment_command_container?: string;
    ports_exposes?: string;
    ports_mappings?: string;
    redirect?: 'www' | 'non-www' | 'both';
    docker_registry_image_name?: string;
    docker_registry_image_tag?: string;
    git_repository?: string;
    git_branch?: string;
    git_commit_sha?: string;
    is_static?: boolean;
    is_spa?: boolean;
    is_auto_deploy_enabled?: boolean;
    is_force_https_enabled?: boolean;
    use_build_server?: boolean;
    static_image?: string;
    is_http_basic_auth_enabled?: boolean;
    http_basic_auth_username?: string;
    http_basic_auth_password?: string;
    health_check_enabled?: boolean;
    health_check_path?: string;
    health_check_port?: string;
    health_check_host?: string;
    health_check_method?: string;
    health_check_return_code?: number;
    health_check_scheme?: string;
    health_check_response_text?: string;
    health_check_interval?: number;
    health_check_timeout?: number;
    health_check_retries?: number;
    health_check_start_period?: number;
    limits_memory?: string;
    limits_memory_swap?: string;
    limits_memory_swappiness?: number;
    limits_memory_reservation?: string;
    limits_cpus?: string;
    limits_cpuset?: string;
    limits_cpu_shares?: number;
    manual_webhook_secret_github?: string;
    manual_webhook_secret_gitlab?: string;
    manual_webhook_secret_bitbucket?: string;
    manual_webhook_secret_gitea?: string;
    custom_labels?: string;
    instant_deploy?: boolean;
    force_domain_override?: boolean;
    connect_to_docker_network?: boolean;
    is_container_label_escape_enabled?: boolean;
}
export interface PersistentStorage {
    id?: number;
    uuid?: string;
    name: string;
    mount_path: string;
    host_path?: string;
    [key: string]: unknown;
}
export interface Service {
    uuid: string;
    name: string;
    description?: string;
    status?: string;
    docker_compose_raw?: string;
    [key: string]: unknown;
}
export interface ServiceSettings {
    name?: string;
    description?: string;
    docker_compose_raw?: string;
    instant_deploy?: boolean;
}
export interface Database {
    uuid: string;
    name: string;
    type?: string;
    status?: string;
    [key: string]: unknown;
}
export interface DatabaseSettings {
    name?: string;
    description?: string;
    image?: string;
    is_public?: boolean;
    public_port?: number;
    limits_memory?: string;
    limits_memory_swap?: string;
    limits_memory_swappiness?: number;
    limits_memory_reservation?: string;
    limits_cpus?: string;
    limits_cpuset?: string;
    limits_cpu_shares?: number;
}
export interface DatabaseBackup {
    id?: number;
    uuid?: string;
    enabled?: boolean;
    frequency?: string;
    save_s3?: boolean;
    s3_storage_uuid?: string;
    databases_to_backup?: string;
    dump_all?: boolean;
    database_backup_retention_amount_locally?: number;
    database_backup_retention_days_locally?: number;
    database_backup_retention_max_storage_locally?: number;
    database_backup_retention_amount_s3?: number;
    database_backup_retention_days_s3?: number;
    database_backup_retention_max_storage_s3?: number;
}
export interface Project {
    uuid: string;
    name: string;
    description?: string;
    environments?: Environment[];
    [key: string]: unknown;
}
export interface ProjectSettings {
    name?: string;
    description?: string;
}
export interface Environment {
    id: number;
    uuid: string;
    name: string;
    project_id: number;
    [key: string]: unknown;
}
export interface Server {
    uuid: string;
    name: string;
    ip?: string;
    description?: string;
    settings?: Record<string, unknown>;
    [key: string]: unknown;
}
export interface Deployment {
    uuid?: string;
    id?: number;
    status?: string;
    created_at?: string;
    [key: string]: unknown;
}
export interface EnvironmentVariable {
    id?: number;
    uuid?: string;
    key: string;
    value: string;
    is_build_time?: boolean;
    is_preview?: boolean;
    [key: string]: unknown;
}
export interface Team {
    id: number;
    name: string;
    description?: string;
    [key: string]: unknown;
}
export interface HealthCheck {
    status: string;
    message?: string;
}
export declare class CoolifyClient {
    private client;
    private baseUrl;
    constructor(config: CoolifyConfig);
    private handleError;
    healthcheck(): Promise<HealthCheck>;
    listTeams(): Promise<Team[]>;
    getCurrentTeam(): Promise<Team>;
    listProjects(): Promise<Project[]>;
    getProject(uuid: string): Promise<Project>;
    createProject(settings: ProjectSettings): Promise<{
        uuid: string;
    }>;
    updateProject(uuid: string, settings: ProjectSettings): Promise<Project>;
    deleteProject(uuid: string): Promise<{
        message: string;
    }>;
    listServers(): Promise<Server[]>;
    getServer(uuid: string): Promise<Server>;
    getServerResources(uuid: string): Promise<unknown>;
    getServerDomains(uuid: string): Promise<unknown>;
    listApplications(): Promise<Application[]>;
    getApplication(uuid: string): Promise<Application>;
    updateApplication(uuid: string, settings: ApplicationSettings): Promise<Application>;
    deleteApplication(uuid: string): Promise<{
        message: string;
    }>;
    startApplication(uuid: string): Promise<{
        message: string;
    }>;
    stopApplication(uuid: string): Promise<{
        message: string;
    }>;
    restartApplication(uuid: string): Promise<{
        message: string;
    }>;
    deployApplication(uuid: string, force?: boolean): Promise<Deployment>;
    getApplicationLogs(uuid: string, lines?: number): Promise<string>;
    listApplicationEnvs(uuid: string): Promise<EnvironmentVariable[]>;
    createApplicationEnv(uuid: string, env: EnvironmentVariable): Promise<EnvironmentVariable>;
    updateApplicationEnv(uuid: string, env: EnvironmentVariable): Promise<EnvironmentVariable>;
    deleteApplicationEnv(uuid: string, envUuid: string): Promise<{
        message: string;
    }>;
    listApplicationStorages(uuid: string): Promise<PersistentStorage[]>;
    createApplicationStorage(uuid: string, storage: PersistentStorage): Promise<PersistentStorage>;
    deleteApplicationStorage(uuid: string, storageUuid: string): Promise<{
        message: string;
    }>;
    listServices(): Promise<Service[]>;
    getService(uuid: string): Promise<Service>;
    updateService(uuid: string, settings: ServiceSettings): Promise<Service>;
    deleteService(uuid: string): Promise<{
        message: string;
    }>;
    startService(uuid: string): Promise<{
        message: string;
    }>;
    stopService(uuid: string): Promise<{
        message: string;
    }>;
    restartService(uuid: string): Promise<{
        message: string;
    }>;
    listServiceEnvs(uuid: string): Promise<EnvironmentVariable[]>;
    updateServiceEnv(uuid: string, env: EnvironmentVariable): Promise<EnvironmentVariable>;
    listDatabases(): Promise<Database[]>;
    getDatabase(uuid: string): Promise<Database>;
    updateDatabase(uuid: string, settings: DatabaseSettings): Promise<Database>;
    deleteDatabase(uuid: string): Promise<{
        message: string;
    }>;
    startDatabase(uuid: string): Promise<{
        message: string;
    }>;
    stopDatabase(uuid: string): Promise<{
        message: string;
    }>;
    restartDatabase(uuid: string): Promise<{
        message: string;
    }>;
    listDatabaseBackups(uuid: string): Promise<DatabaseBackup[]>;
    createDatabaseBackup(uuid: string, backup: DatabaseBackup): Promise<DatabaseBackup>;
    updateDatabaseBackup(uuid: string, backupUuid: string, backup: DatabaseBackup): Promise<DatabaseBackup>;
    deleteDatabaseBackup(uuid: string, backupUuid: string): Promise<{
        message: string;
    }>;
    triggerDatabaseBackup(uuid: string, backupUuid: string): Promise<{
        message: string;
    }>;
    listDeployments(): Promise<Deployment[]>;
    getDeployment(uuid: string): Promise<Deployment>;
}
//# sourceMappingURL=coolify-client.d.ts.map