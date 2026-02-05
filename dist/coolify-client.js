import axios, { AxiosError } from 'axios';
export class CoolifyClient {
    client;
    baseUrl;
    constructor(config) {
        this.baseUrl = config.apiUrl.replace(/\/$/, '');
        this.client = axios.create({
            baseURL: `${this.baseUrl}/api/v1`,
            headers: {
                'Authorization': `Bearer ${config.apiToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 30000,
        });
    }
    handleError(error) {
        if (error instanceof AxiosError) {
            const message = error.response?.data?.message || error.message;
            const status = error.response?.status;
            throw new Error(`Coolify API Error (${status}): ${message}`);
        }
        throw error;
    }
    // ========== Health Check ==========
    async healthcheck() {
        try {
            const response = await this.client.get('/healthcheck');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Teams ==========
    async listTeams() {
        try {
            const response = await this.client.get('/teams');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getCurrentTeam() {
        try {
            const response = await this.client.get('/teams/current');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Projects ==========
    async listProjects() {
        try {
            const response = await this.client.get('/projects');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getProject(uuid) {
        try {
            const response = await this.client.get(`/projects/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async createProject(settings) {
        try {
            const response = await this.client.post('/projects', settings);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async updateProject(uuid, settings) {
        try {
            const response = await this.client.patch(`/projects/${uuid}`, settings);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async deleteProject(uuid) {
        try {
            const response = await this.client.delete(`/projects/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Servers ==========
    async listServers() {
        try {
            const response = await this.client.get('/servers');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getServer(uuid) {
        try {
            const response = await this.client.get(`/servers/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getServerResources(uuid) {
        try {
            const response = await this.client.get(`/servers/${uuid}/resources`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getServerDomains(uuid) {
        try {
            const response = await this.client.get(`/servers/${uuid}/domains`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Applications ==========
    async listApplications() {
        try {
            const response = await this.client.get('/applications');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getApplication(uuid) {
        try {
            const response = await this.client.get(`/applications/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async updateApplication(uuid, settings) {
        try {
            const response = await this.client.patch(`/applications/${uuid}`, settings);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async deleteApplication(uuid) {
        try {
            const response = await this.client.delete(`/applications/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async startApplication(uuid) {
        try {
            const response = await this.client.post(`/applications/${uuid}/start`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async stopApplication(uuid) {
        try {
            const response = await this.client.post(`/applications/${uuid}/stop`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async restartApplication(uuid) {
        try {
            const response = await this.client.post(`/applications/${uuid}/restart`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async deployApplication(uuid, force) {
        try {
            const params = force ? { force: 'true' } : {};
            const response = await this.client.post(`/applications/${uuid}/deploy`, null, { params });
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getApplicationLogs(uuid, lines) {
        try {
            const params = lines ? { lines: lines.toString() } : {};
            const response = await this.client.get(`/applications/${uuid}/logs`, { params });
            return typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Application Environment Variables ==========
    async listApplicationEnvs(uuid) {
        try {
            const response = await this.client.get(`/applications/${uuid}/envs`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async createApplicationEnv(uuid, env) {
        try {
            const response = await this.client.post(`/applications/${uuid}/envs`, env);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async updateApplicationEnv(uuid, env) {
        try {
            const response = await this.client.patch(`/applications/${uuid}/envs`, env);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async deleteApplicationEnv(uuid, envUuid) {
        try {
            const response = await this.client.delete(`/applications/${uuid}/envs/${envUuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Application Persistent Storage ==========
    async listApplicationStorages(uuid) {
        try {
            const response = await this.client.get(`/applications/${uuid}/storages`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async createApplicationStorage(uuid, storage) {
        try {
            const response = await this.client.post(`/applications/${uuid}/storages`, storage);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async deleteApplicationStorage(uuid, storageUuid) {
        try {
            const response = await this.client.delete(`/applications/${uuid}/storages/${storageUuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Services ==========
    async listServices() {
        try {
            const response = await this.client.get('/services');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getService(uuid) {
        try {
            const response = await this.client.get(`/services/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async updateService(uuid, settings) {
        try {
            const response = await this.client.patch(`/services/${uuid}`, settings);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async deleteService(uuid) {
        try {
            const response = await this.client.delete(`/services/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async startService(uuid) {
        try {
            const response = await this.client.post(`/services/${uuid}/start`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async stopService(uuid) {
        try {
            const response = await this.client.post(`/services/${uuid}/stop`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async restartService(uuid) {
        try {
            const response = await this.client.post(`/services/${uuid}/restart`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Service Environment Variables ==========
    async listServiceEnvs(uuid) {
        try {
            const response = await this.client.get(`/services/${uuid}/envs`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async updateServiceEnv(uuid, env) {
        try {
            const response = await this.client.patch(`/services/${uuid}/envs`, env);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Databases ==========
    async listDatabases() {
        try {
            const response = await this.client.get('/databases');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getDatabase(uuid) {
        try {
            const response = await this.client.get(`/databases/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async updateDatabase(uuid, settings) {
        try {
            const response = await this.client.patch(`/databases/${uuid}`, settings);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async deleteDatabase(uuid) {
        try {
            const response = await this.client.delete(`/databases/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async startDatabase(uuid) {
        try {
            const response = await this.client.post(`/databases/${uuid}/start`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async stopDatabase(uuid) {
        try {
            const response = await this.client.post(`/databases/${uuid}/stop`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async restartDatabase(uuid) {
        try {
            const response = await this.client.post(`/databases/${uuid}/restart`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Database Backups ==========
    async listDatabaseBackups(uuid) {
        try {
            const response = await this.client.get(`/databases/${uuid}/backups`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async createDatabaseBackup(uuid, backup) {
        try {
            const response = await this.client.post(`/databases/${uuid}/backups`, backup);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async updateDatabaseBackup(uuid, backupUuid, backup) {
        try {
            const response = await this.client.patch(`/databases/${uuid}/backups/${backupUuid}`, backup);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async deleteDatabaseBackup(uuid, backupUuid) {
        try {
            const response = await this.client.delete(`/databases/${uuid}/backups/${backupUuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async triggerDatabaseBackup(uuid, backupUuid) {
        try {
            const response = await this.client.post(`/databases/${uuid}/backups/${backupUuid}/trigger`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    // ========== Deployments ==========
    async listDeployments() {
        try {
            const response = await this.client.get('/deployments');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getDeployment(uuid) {
        try {
            const response = await this.client.get(`/deployments/${uuid}`);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
}
//# sourceMappingURL=coolify-client.js.map