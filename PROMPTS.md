# Bitácora de Prompt Engineering — RetroCycle

Este documento detalla la estrategia de **Prompt Engineering** y orquestación utilizada con **Google AI Studio** para el prototipado rápido y desarrollo asistido por IA de la plataforma RetroCycle.


## Objetivo de la Metodología
Evaluar la capacidad de los LLMs para generar arquitecturas cliente-servidor de grado de producción (FastAPI + React + PostgreSQL), aplicando principios de desarrollo guiado y validación técnica previa.


## Prompts Utilizados

### Prompt Inicial — Diseño y Desarrollo de RetroCycle

> "Necesito que diseñes y desarrolles una aplicación web completa para un marketplace de componentes informáticos antiguos y reciclables.
> 
> **Objetivo principal:**  
> Crear una plataforma que conecte a personas que desean deshacerse de hardware antiguo (computadoras, componentes, periféricos) con usuarios interesados en comprar, intercambiar o reciclar ese material. La aplicación debe facilitar transacciones, comunicación entre usuarios y reducir el desperdicio electrónico.
> 
> **Stack tecnológico (justifica tu elección):**  
> - **Backend:** Flask o FastAPI (Python) — justifica por qué elegiste uno sobre el otro considerando los requisitos de la API REST, autenticación, y manejo de mensajería.  
> - **Frontend:** React o Next.js — justifica tu elección según las necesidades de responsividad y gestión de estado.  
> - **Base de datos:** PostgreSQL (relacional).  
> - **Entorno:** Local con instrucciones claras para configuración.  
> 
> **Funcionalidades esenciales:**  
> - Sistema de autenticación y perfiles de usuario (vendedores, compradores, recicladores).  
> - Listado de componentes con búsqueda, filtros por tipo de hardware y estado (funcionando, para piezas, para reciclar).  
> - Sistema de publicación: usuarios pueden crear anuncios con fotos, descripción, precio o disponibilidad para intercambio.  
> - Modalidades de transacción: venta con precio fijo, ofertas/negociación, intercambio directo, donación para reciclaje.  
> - Sistema de reputación/valoraciones de usuarios.  
> - Categorías de componentes: placas madre, memorias RAM, discos duros, GPUs, fuentes, monitores, laptops completas, etc.  
> 
> **Requisitos de producción:**  
> - **Responsividad:** Funcional en celular y desktop.  
> - **Interfaz:** Intuitiva, enfocada en facilitar la transacción rápidamente.  
> - **Seguridad:** Manejo seguro de transacciones y datos de usuario.  
> - **Manejo de errores:** Gestión robusta de excepciones y validación de entrada en frontend y backend.  
> - **Testing:** Tests unitarios e integración para funcionalidades críticas (autenticación, publicación, búsqueda, mensajería). El cliente no debe tener acceso a esto.  
> - **Documentación:** Documentación de código claro, guía de API si aplica, y guía de usuario para la plataforma.  
> 
> **Entregables:**  
> - Código funcional y estructura del proyecto organizada.  
> - Diseño de base de datos PostgreSQL (esquema, relaciones, índices).  
> - Instrucciones claras para ejecutar la aplicación en entorno local (setup, variables de entorno, migraciones).  
> - Documentación básica de cómo usar la plataforma.  
> - Tests automatizados para validar funcionalidades críticas.  
> 
> **Prioridad MVP:**  
> Construye una versión mínimo viable funcional que demuestre el concepto completo, con énfasis en que el sistema de publicación y búsqueda funcione correctamente. La solución debe ser production-ready: incluye manejo robusto de errores, validación de datos, tests para funcionalidades clave, y documentación suficiente para que otro desarrollador pueda ejecutar y mantener el código."

---

### Prompt 2: Integración de Geolocalización y Maps API
> "Implementa la API de Google Maps Python en el componente/sección 'Mapa de Cercanía'. La aplicación debe solicitar la geolocalización del navegador del usuario (HTML5\Geolocation\ API) para centrar el mapa en sus coordenadas (latitud y longitud) e identificar puntos de interés cercanos. Incluye el manejo de permisos denegados o fallos de ubicación mediante un estado por defecto."

---

### Prompt 3: Implementacion de Calculadora de Impacto Ambiental y Huella RAEE

> “Diseña e implementa un componente interactivo de 'Calculadora de Impacto Ambiental y Huella RAEE' para la plataforma RetroCycle. El usuario debe poder interactuar con rangos deslizables (sliders) para simular el peso o la cantidad de componentes a reciclar (placas madre, memorias RAM, GPUs, discos duros, monitores CRT). A partir del peso total
gestionado, el sistema debe calcular dinámicamente indicadores de beneficios ecológicos, incluyendo: kg de CO2 ahorrado, gramos de cobre puro reclamado, miligramos de oro
recuperable y gramos de tóxicos (plomo, bromo, cadmio) neutralizados. Presenta los resultados en tarjetas visuales con métricas claras”

---

### Prompt 4: Integración de servicio de mensajeria mendiante Websockets

> “Desarrolla un módulo de mensajería en tiempo real enfocado en la negociación de hardware antiguo entre comprador y vendedor. El sistema debe desplegarse como un panel lateral integrado que muestre el resumen del producto negociado. Debe soportar el envío de propuestas de contraoferta estructuradas (monto propuesto y condiciones de entrega/punto de encuentro) e incorporar un bloque de advertencias de seguridad orientadas al rubro informático retro (por ejemplo, recomendaciones sobre puntos de encuentro públicos y verificación de componentes con fuentes de alimentación reguladas).”
