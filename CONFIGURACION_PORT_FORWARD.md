# Configuración de Port Forwarding para Microservicios

## URLs Configuradas

El frontend ahora está configurado para conectarse a los microservicios usando port forwarding a través de DevTunnels:

### Microservicios Configurados

| Servicio | Puerto | URL |
|----------|--------|-----|
| **UsuarioService** | 8081 | https://t4ld1ws9-8081.brs.devtunnels.ms |
| **InventarioService** | 8082 | https://t4ld1ws9-8082.brs.devtunnels.ms |
| **GeografiaService** | 8083 | https://t4ld1ws9-8083.brs.devtunnels.ms |
| **EntregasService** | 8084 | https://t4ld1ws9-8084.brs.devtunnels.ms |
| **VentasService** | 8085 | https://t4ld1ws9-8085.brs.devtunnels.ms |

## Archivos Modificados

### 1. `.env`
Actualizado con las URLs de port forwarding:
```bash
VITE_API_USUARIO_URL=https://t4ld1ws9-8081.brs.devtunnels.ms
VITE_API_INVENTARIO_URL=https://t4ld1ws9-8082.brs.devtunnels.ms
VITE_API_GEOGRAFIA_URL=https://t4ld1ws9-8083.brs.devtunnels.ms
VITE_API_ENTREGAS_URL=https://t4ld1ws9-8084.brs.devtunnels.ms
VITE_API_VENTAS_URL=https://t4ld1ws9-8085.brs.devtunnels.ms
```

### 2. `src/services/contactService.ts`
Cambiado de URL hardcodeada a variable de entorno:
```typescript
const API_URL = `${import.meta.env.VITE_API_USUARIO_URL}/api/v1/contacto`;
```

### 3. `src/services/__tests__/contactService.test.ts`
Actualizado el test para usar la variable de entorno.

## Servicios que Usan las Variables de Entorno

Todos los servicios ya estaban configurados correctamente para usar variables de entorno:

- ✅ `authService.ts` - Usa `VITE_API_USUARIO_URL`
- ✅ `inventarioService.ts` - Usa `VITE_API_INVENTARIO_URL`
- ✅ `geografiaService.ts` - Usa `VITE_API_GEOGRAFIA_URL`
- ✅ `entregasService.ts` - Usa `VITE_API_ENTREGAS_URL`
- ✅ `ventasService.ts` - Usa `VITE_API_VENTAS_URL`
- ✅ `contactService.ts` - **Actualizado** para usar `VITE_API_USUARIO_URL`

## Patrón de URL

El patrón de URL es:
```
https://t4ld1ws9-{PUERTO}.brs.devtunnels.ms
```

Donde `{PUERTO}` es el puerto del microservicio correspondiente (8081, 8082, 8083, 8084, 8085).

## Cómo Usar

1. **Reiniciar el servidor de desarrollo** para que tome las nuevas variables de entorno:
   ```bash
   npm run dev
   ```

2. **Verificar que los microservicios estén corriendo** en los puertos especificados y accesibles a través de DevTunnels.

3. **Probar la conexión** desde el frontend navegando a las diferentes páginas que consumen los servicios.

## Notas Importantes

- ⚠️ **Reinicio Requerido**: Después de cambiar el archivo `.env`, debes reiniciar el servidor de desarrollo de Vite.
- 🔒 **HTTPS**: Las URLs usan HTTPS, asegúrate de que los certificados estén configurados correctamente en DevTunnels.
- 🌐 **CORS**: Verifica que los microservicios tengan configurado CORS para aceptar peticiones desde el dominio del frontend.

## Cambiar URLs en el Futuro

Si necesitas cambiar las URLs (por ejemplo, si el tunnel ID cambia), simplemente edita el archivo `.env` y reinicia el servidor de desarrollo.
