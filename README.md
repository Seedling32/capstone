# Pedal Pact

**Pedal Pact** is a full-stack web application for organizing and joining group bicycle rides.  
Built as the capstone project for my AAS in Software and Web Development, it focuses on creating an accessible, easy-to-use platform for cyclists to find, create, and manage local rides.

## Why I Built Pedal Pact

I wanted to combine my passion for development with my love for outdoor recreation.  
**Pedal Pact** provides a way for riders of all levels to meet up, explore new routes, and build community — with a simple, intuitive experience from sign-up to ride day.

This project challenged me to integrate multiple APIs, manage complex user roles, and create an efficient, mobile-first design — skills that will directly benefit my future in full-stack development.

## Features

**Interactive Map-Based Route Planning**  
 Draw and save custom bike routes directly on the map.

**Browse and Join Rides**  
 View upcoming rides, sign up as a participant, and see who’s riding.

**Role-Based Access**  
 Public users can browse rides, members can join rides, and admins can create and manage events.

**Secure Authentication**  
 Email/password login system with protected admin features.

**Ride-Specific Weather Forecasts**  
 Get local weather information for each planned ride.

**Elevation Charts**  
 View distance vs. elevation graphs for saved routes.

**Mobile-First, Responsive Design**  
 Designed for a seamless experience on phones, tablets, and desktops.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend**: React 19, Tailwind CSS
- **Backend**: Prisma ORM, Server Actions
- **Database**: PostgreSQL (hosted on [Neon](https://neon.tech/))
- **Authentication**: NextAuth
- **Mapping**: Google Maps API
- **Hosting**: Vercel
- **Other APIs**: National Weather Service (NOAA) for weather data

For the full database diagram, you can view it [Here](https://dbdiagram.io/d/pedal-pact-678bc92f6b7fa355c34b58c8), hosted by dbdiagram.io

Alternatively, you can view the SQL file [Here](assets/pedal-pact.sql)

## Photo Credits:

All photos used in this project are courtesy of Burke Saunders and are used with permission. These images are &copy;Burke Saunders, all rights reserved. Please do not reuse without permission.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project has an extensive .env file for services such as:

- **Google Maps API**
- **UploadThing**
- **NextAuth**
- **NEON Database**
- **Resend**
- **And more...**

Without the .env file the project will fail to build correctly and will not run on your local machine.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
