# Sistema Académico Integral

Una plataforma web educativa integral para instituciones académicas que combina las funciones de un sistema académico, Google Classroom y comunicación interna institucional.

## 🚀 Tecnologías

- Next.js 15 con App Router
- React 19
- TypeScript
- TailwindCSS + shadcn/ui
- Firebase (Auth, Firestore, Storage, Cloud Messaging)
- Framer Motion

## 🌟 Características

- Autenticación por roles (Estudiante, Profesor, Coordinador, Secretaría, Padre)
- Gestión académica completa
- Mensajería en tiempo real
- Diseño elegante con temas dinámicos
- Internacionalización (i18n)
- Modo oscuro y temas personalizables

## 📦 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   ├── student/
│   │   ├── teacher/
│   │   ├── coordinator/
│   │   ├── secretary/
│   │   └── parent/
│   └── auth/
│       ├── login/
│       ├── register/
│       └── reset-password/
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── messaging/
│   ├── notifications/
│   ├── grades/
│   ├── schedule/
│   ├── calendar/
│   ├── reports/
│   ├── certificates/
│   └── settings/
│
├── components/
├── hooks/
├── utils/
├── lib/firebase.ts
└── styles/
```

## 🛠️ Configuración del Proyecto

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd proyecto-secret
```

2. Instala las dependencias:

```bash
npm install
```

3. Copia el archivo .env.example a .env.local y configura las variables de entorno:

```bash
cp .env.example .env.local
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## 🌐 Entorno de Desarrollo

- Node.js 18.x o superior
- npm 9.x o superior
- Visual Studio Code (recomendado)

## 📋 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción
- `npm start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código con Prettier

## 📚 Documentación

Para más información sobre las tecnologías utilizadas:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
