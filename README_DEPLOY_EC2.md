# Despliegue en EC2 con Docker / Docker Compose (Front-end)

Esta guía explica cómo desplegar este frontend React/Vite en una instancia EC2 usando Docker y Docker Compose. El contenedor ejecuta un servidor Node.js (Express) que sirve los archivos estáticos.

Requisitos
- Cuenta AWS con permisos para crear instancias EC2.
- Clave privada (.pem) para SSH a la instancia.

Resumen de pasos
1) Crear una instancia EC2
2) Abrir puertos en el Security Group (22 para SSH, 80 para HTTP)
3) Instalar Docker y Docker Compose
4) Subir el código o clonar el repo
5) Crear `.env` con `API_URL` y variables (si aplica)
6) Lanzar con Docker Compose

----

1) Preparar la instancia EC2
- Crea una instancia (Amazon Linux 2 o Ubuntu 22.04/20.04 recomendado)
- Asigna un Security Group que permita al menos:
  - 22 (SSH)
  - 80 (HTTP)

2) Instalar Docker y Docker Compose en EC2
- Amazon Linux 2:
```bash
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
# Docker Compose (si no está disponible)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

- Ubuntu/Debian:
```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
# Instalar docker-compose si lo necesitas
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3) Subir tu código a la instancia
- Opción A: git clone
```bash
git clone <tu-repo-url>
cd <repo>
```
- Opción B: scp/rsync desde tu máquina local

4) Crear archivo `.env` en la raíz del proyecto
- Este proyecto utiliza `API_URL` para apuntar a tu backend (ej: API REST). Crea `.env` con:
```dotenv
API_URL=http://<BACKEND_HOST>:3000
```
- El `.env` está en `.gitignore` por seguridad. No subas credenciales al repo.

5) Construir y ejecutar con Docker Compose
- Desde la raíz del proyecto en la instancia EC2:
```bash
# Construir la imagen (usa Dockerfile que ya está en el repo)
docker-compose build

# Ejecutar en background
docker-compose up -d
```

6) Ver logs y estado
```bash
# Ver logs del servicio
docker-compose logs -f

# Ver contenedores en ejecución
docker ps
```

Notas de seguridad y red
- Si tu backend está en la misma VPC, usa la IP privada o endpoint privado en `API_URL`.
- Para producción considera:
  - Usar ECR + ECS o EKS en vez de EC2 directo.
  - Usar Secrets Manager o Parameter Store para credenciales.
  - Poner HTTPS en front con ALB/ACM o un reverse proxy.

Problema común: cambiar `API_URL` sin rebuild
- Actualmente el frontend usa `import.meta.env.VITE_API_URL || import.meta.env.API_URL` (resuelta en build time). Si necesitas cambiar la URL del backend sin reconstruir la imagen, te puedo:
  - Implementar un archivo `config.json` servido por Express que el frontend consulte en runtime, o
  - Injectar la variable en runtime a través de un script que reescribe el `index.html` y carga la variable en `window.__APP_CONFIG__`.

Si quieres que haga el cambio para lectura runtime de `API_URL`, dime y lo implemento.

---

Si quieres que automatice la creación de la imagen en ECR o un `systemd` unit para el contenedor, lo preparo también.
