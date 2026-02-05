# Coolify MCP Server

Coolify projelerinizi MCP (Model Context Protocol) üzerinden yönetmenizi sağlayan bir sunucu. Artık tüm Coolify ayarlarını programatik olarak yönetebilirsiniz.

## Kurulum

```bash
cd "/Users/eminatmaca/Desktop/coolify mcp"
npm install
npm run build
```

## Kullanım

### Claude Desktop veya Başka Bir MCP Client İçin

`~/Library/Application Support/Claude/claude_desktop_config.json` dosyasına ekleyin:

```json
{
  "mcpServers": {
    "coolify": {
      "command": "node",
      "args": [
        "/Users/eminatmaca/Desktop/coolify mcp/dist/index.js",
        "--url", "https://coolify.opsivio.com",
        "--token", "YOUR_API_TOKEN"
      ]
    }
  }
}
```

### Alternatif Kullanım (Positional Arguments)

```json
{
  "mcpServers": {
    "coolify": {
      "command": "node",
      "args": [
        "/Users/eminatmaca/Desktop/coolify mcp/dist/index.js",
        "https://coolify.opsivio.com",
        "YOUR_API_TOKEN"
      ]
    }
  }
}
```

### Environment Variables ile Kullanım

```json
{
  "mcpServers": {
    "coolify": {
      "command": "node",
      "args": ["/Users/eminatmaca/Desktop/coolify mcp/dist/index.js"],
      "env": {
        "COOLIFY_API_URL": "https://coolify.opsivio.com",
        "COOLIFY_API_TOKEN": "YOUR_API_TOKEN"
      }
    }
  }
}
```

## Mevcut Araçlar (Tools) - 55+ Tool

### Genel
| Tool | Açıklama |
|------|----------|
| `healthcheck` | Coolify API durumunu kontrol et |
| `list_teams` | Tüm takımları listele |
| `get_current_team` | Aktif takım bilgisini getir |

### Projeler
| Tool | Açıklama |
|------|----------|
| `list_projects` | Tüm projeleri listele |
| `get_project` | Proje detaylarını getir |
| `create_project` | Yeni proje oluştur |
| `update_project` | Proje ayarlarını güncelle |
| `delete_project` | Projeyi sil |

### Sunucular
| Tool | Açıklama |
|------|----------|
| `list_servers` | Tüm sunucuları listele |
| `get_server` | Sunucu detaylarını getir |
| `get_server_resources` | Sunucudaki kaynakları listele |
| `get_server_domains` | Sunucudaki domainleri listele |

### Uygulamalar
| Tool | Açıklama |
|------|----------|
| `list_applications` | Tüm uygulamaları listele |
| `get_application` | Uygulama detaylarını getir |
| `update_application` | **Uygulama ayarlarını güncelle (General, Advanced, Network, Healthcheck, Resource Limits, Webhooks)** |
| `delete_application` | Uygulamayı sil |
| `start_application` | Uygulamayı başlat |
| `stop_application` | Uygulamayı durdur |
| `restart_application` | Uygulamayı yeniden başlat |
| `deploy_application` | Uygulamayı deploy et |
| `get_application_logs` | Uygulama loglarını getir |

### Uygulama Ortam Değişkenleri
| Tool | Açıklama |
|------|----------|
| `list_application_envs` | Ortam değişkenlerini listele |
| `create_application_env` | Ortam değişkeni oluştur |
| `update_application_env` | Ortam değişkenini güncelle |
| `delete_application_env` | Ortam değişkenini sil |

### Uygulama Persistent Storage
| Tool | Açıklama |
|------|----------|
| `list_application_storages` | Storage volume'lerini listele |
| `create_application_storage` | Yeni storage volume oluştur |
| `delete_application_storage` | Storage volume'ü sil |

### Servisler
| Tool | Açıklama |
|------|----------|
| `list_services` | Tüm servisleri listele |
| `get_service` | Servis detaylarını getir |
| `update_service` | Servis ayarlarını güncelle |
| `delete_service` | Servisi sil |
| `start_service` | Servisi başlat |
| `stop_service` | Servisi durdur |
| `restart_service` | Servisi yeniden başlat |
| `list_service_envs` | Ortam değişkenlerini listele |
| `update_service_env` | Ortam değişkenini güncelle |

### Veritabanları
| Tool | Açıklama |
|------|----------|
| `list_databases` | Tüm veritabanlarını listele |
| `get_database` | Veritabanı detaylarını getir |
| `update_database` | **Veritabanı ayarlarını güncelle (Resource Limits dahil)** |
| `delete_database` | Veritabanını sil |
| `start_database` | Veritabanını başlat |
| `stop_database` | Veritabanını durdur |
| `restart_database` | Veritabanını yeniden başlat |

### Veritabanı Yedekleme
| Tool | Açıklama |
|------|----------|
| `list_database_backups` | Yedekleme konfigürasyonlarını listele |
| `create_database_backup` | Yeni yedekleme konfigürasyonu oluştur |
| `update_database_backup` | Yedekleme konfigürasyonunu güncelle |
| `delete_database_backup` | Yedekleme konfigürasyonunu sil |
| `trigger_database_backup` | Anlık yedekleme tetikle |

### Deployment'lar
| Tool | Açıklama |
|------|----------|
| `list_deployments` | Tüm deployment'ları listele |
| `get_deployment` | Deployment detaylarını getir |

## Örnek Kullanımlar

### Uygulama Ayarlarını Güncelleme

```
update_application with:
- uuid: "abc123"
- name: "My App"
- domains: "app.example.com,www.app.example.com"
- is_auto_deploy_enabled: true
- is_force_https_enabled: true
- limits_memory: "512M"
- limits_cpus: "1"
- health_check_enabled: true
- health_check_path: "/health"
```

### Persistent Storage Oluşturma

```
create_application_storage with:
- uuid: "abc123"
- name: "data-volume"
- mount_path: "/data"
- host_path: "/opt/myapp/data"
```

### Veritabanı Yedekleme Konfigürasyonu

```
create_database_backup with:
- uuid: "db123"
- enabled: true
- frequency: "0 2 * * *" (Her gece 02:00)
- dump_all: true
```

## Desteklenen Uygulama Ayarları

`update_application` aracı aşağıdaki ayarları destekler:

### General
- `name`, `description`, `domains`

### Build Settings
- `build_pack` (nixpacks, static, dockerfile, dockercompose)
- `base_directory`, `publish_directory`, `dockerfile_location`
- `install_command`, `build_command`, `start_command`
- `pre_deployment_command`, `post_deployment_command`

### Network
- `ports_exposes`, `ports_mappings`, `redirect`

### Git Source
- `git_repository`, `git_branch`, `git_commit_sha`

### Advanced
- `is_static`, `is_spa`, `is_auto_deploy_enabled`
- `is_force_https_enabled`, `use_build_server`

### HTTP Basic Auth
- `is_http_basic_auth_enabled`, `http_basic_auth_username`, `http_basic_auth_password`

### Health Check
- `health_check_enabled`, `health_check_path`, `health_check_port`
- `health_check_interval`, `health_check_timeout`, `health_check_retries`

### Resource Limits
- `limits_memory`, `limits_memory_swap`, `limits_memory_reservation`
- `limits_cpus`, `limits_cpu_shares`

### Webhooks
- `manual_webhook_secret_github`, `manual_webhook_secret_gitlab`
- `manual_webhook_secret_bitbucket`, `manual_webhook_secret_gitea`

### Labels & Docker
- `custom_labels`, `custom_docker_run_options`
- `instant_deploy`, `connect_to_docker_network`

## API Token Nasıl Alınır?

1. Coolify Dashboard'a giriş yapın
2. **Settings** → **Keys & Tokens** bölümüne gidin
3. **Generate New Token** butonuna tıklayın
4. Token'a bir isim verin ve **Root** yetkisi seçin
5. Token'ı kopyalayın ve güvenli bir yerde saklayın

## Lisans

MIT
