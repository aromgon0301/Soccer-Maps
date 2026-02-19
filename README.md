# Soccer-Maps
Plan de Soccer Maps, David Hernández, Alec Román y Néstor Paya
Una plataforma digital (app y web) que mapea estadios de fútbol y ofrece información geolocalizada para aficionados, también tiene una comunidad. Además, puede tener posibles colaboraciones con clubes y negocios locales.
ip 100.30.25.206
Hemos usado V0 para el codigo

## Base de datos (MongoDB local)

La aplicación ahora persiste formularios y datos de comunidad/perfil/reservas/suscripción en MongoDB.

1. Levanta MongoDB en local (puerto `27017`).
2. Define variables de entorno opcionales en `.env.local`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/soccer_maps
MONGODB_DB=soccer_maps
```

Si no defines variables, se usa por defecto `mongodb://127.0.0.1:27017/soccer_maps`.
