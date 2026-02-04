# 🐾 Peluquería Canina | Premium Pet Care

Este es una aplicación moderna y premium para la gestión de una peluquería canina, diseñada para ofrecer la mejor experiencia tanto a los dueños de mascotas como a los administradores.

## 🚀 Tecnologías Principales

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Base de Datos & Auth**: [Supabase](https://supabase.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)

## ✨ Características

- **Diseño Premium**: Interfaz moderna con una estética amigable, bordes redondeados y una paleta de colores pastel cuidadosamente seleccionada.
- **Reserva de Turnos**: Flujo de reserva intuitivo paso a paso para seleccionar servicios, fechas y horarios.
- **Seguimiento en Vivo**: Rastreador de estado en tiempo real para que los dueños vean el progreso de su mascota (Baño, Secado, Listo, etc.).
- **Panel Administrativo**: Gestión completa de turnos, horarios y configuración del negocio.
- **Seguridad**: Implementación de políticas RLS (Row Level Security) en Supabase y autenticación robusta.

## 🛠️ Flujo de Trabajo (Git)

Mantenemos un flujo de trabajo organizado para asegurar la estabilidad:

- **`main`**: Rama de producción. Solo contiene código estable y probado.
- **`develop`**: Rama principal de desarrollo. Aquí es donde se integran las nuevas funcionalidades y correcciones antes de pasar a producción.

## 🏁 Comenzando

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```

4. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
