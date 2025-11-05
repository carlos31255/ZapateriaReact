// BASE DE DATOS SIMULADA EN JAVASCRIPT
// Simula una base de datos usando localStorage

// ==================== CONSTANTES ====================

const STORAGE_KEYS = {
  USUARIOS: 'usuarios',
  PRODUCTOS: 'productos',
  ARTICULOS_BLOG: 'articulosBlog',
  CONTACTOS: 'contactos',
  PEDIDOS: 'pedidos',
  USUARIO_ACTUAL: 'usuarioActual',
  CARRITO: 'carrito'
};

// ==================== DATOS INICIALES - PRODUCTOS ====================

export const productosIniciales = [
  {
    id: 1,
    nombre: "Zapatos Oxford Clásicos",
    precio: 89990,
    imagen: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400",
    categoria: "hombre",
    descripcion: "Elegantes zapatos Oxford de cuero genuino para hombre",
    stock: 35,
    stockPorTalla: [
      { talla: 38, stock: 3 },
      { talla: 39, stock: 4 },
      { talla: 40, stock: 5 },
      { talla: 41, stock: 6 },
      { talla: 42, stock: 7 },
      { talla: 43, stock: 5 },
      { talla: 44, stock: 3 },
      { talla: 45, stock: 2 }
    ],
    destacado: true
  },
  {
    id: 2,
    nombre: "Tacones Elegantes",
    precio: 75990,
    imagen: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    categoria: "mujer",
    descripcion: "Tacones altos elegantes para ocasiones especiales",
    stock: 28,
    stockPorTalla: [
      { talla: 35, stock: 2 },
      { talla: 36, stock: 4 },
      { talla: 37, stock: 5 },
      { talla: 38, stock: 6 },
      { talla: 39, stock: 5 },
      { talla: 40, stock: 4 },
      { talla: 41, stock: 2 }
    ],
    destacado: true
  },
  {
    id: 3,
    nombre: "Zapatillas Deportivas",
    precio: 65990,
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    categoria: "deportivos",
    descripcion: "Zapatillas deportivas cómodas para running",
    stock: 48,
    stockPorTalla: [
      { talla: 36, stock: 3 },
      { talla: 37, stock: 4 },
      { talla: 38, stock: 5 },
      { talla: 39, stock: 6 },
      { talla: 40, stock: 7 },
      { talla: 41, stock: 6 },
      { talla: 42, stock: 6 },
      { talla: 43, stock: 5 },
      { talla: 44, stock: 4 },
      { talla: 45, stock: 2 }
    ],
    destacado: true
  },
  {
    id: 4,
    nombre: "Botas de Cuero",
    precio: 125990,
    imagen: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400",
    categoria: "hombre",
    descripcion: "Botas robustas de cuero para uso diario",
    stock: 32,
    stockPorTalla: [
      { talla: 39, stock: 3 },
      { talla: 40, stock: 5 },
      { talla: 41, stock: 6 },
      { talla: 42, stock: 7 },
      { talla: 43, stock: 6 },
      { talla: 44, stock: 3 },
      { talla: 45, stock: 2 }
    ],
    destacado: false
  },
  {
    id: 5,
    nombre: "Sandalias de Verano",
    precio: 45990,
    imagen: "https://images.unsplash.com/photo-1603808033176-e2f2d3a00645?w=400",
    categoria: "mujer",
    descripcion: "Sandalias cómodas para el verano",
    stock: 40,
    stockPorTalla: [
      { talla: 35, stock: 4 },
      { talla: 36, stock: 5 },
      { talla: 37, stock: 6 },
      { talla: 38, stock: 7 },
      { talla: 39, stock: 6 },
      { talla: 40, stock: 6 },
      { talla: 41, stock: 4 },
      { talla: 42, stock: 2 }
    ],
    destacado: false
  },
  {
    id: 6,
    nombre: "Zapatos Escolares",
    precio: 35990,
    imagen: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
    categoria: "niños",
    descripcion: "Zapatos escolares resistentes y cómodos",
    stock: 0,
    stockPorTalla: [
      { talla: 35, stock: 0 },
      { talla: 36, stock: 0 },
      { talla: 37, stock: 0 },
      { talla: 38, stock: 0 }
    ],
    destacado: false
  },
  {
    id: 7,
    nombre: "Zapatillas Casual",
    precio: 55990,
    imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
    categoria: "mujer",
    descripcion: "Zapatillas casuales para uso diario",
    stock: 38,
    stockPorTalla: [
      { talla: 35, stock: 3 },
      { talla: 36, stock: 4 },
      { talla: 37, stock: 5 },
      { talla: 38, stock: 6 },
      { talla: 39, stock: 6 },
      { talla: 40, stock: 5 },
      { talla: 41, stock: 5 },
      { talla: 42, stock: 4 }
    ],
    destacado: true
  },
  {
    id: 8,
    nombre: "Zapatos de Vestir",
    precio: 95990,
    imagen: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400",
    categoria: "hombre",
    descripcion: "Zapatos formales para eventos especiales",
    stock: 30,
    stockPorTalla: [
      { talla: 38, stock: 2 },
      { talla: 39, stock: 4 },
      { talla: 40, stock: 5 },
      { talla: 41, stock: 6 },
      { talla: 42, stock: 5 },
      { talla: 43, stock: 4 },
      { talla: 44, stock: 3 },
      { talla: 45, stock: 1 }
    ],
    destacado: false
  }
];

// ==================== DATOS INICIALES - USUARIOS ====================

export const usuariosIniciales = [
  {
    id: '1',
    run: '11111111-1',
    nombre: 'Administrador Sistema',
    email: 'admin@stepstyle.cl',
    contrasena: 'admin123',
    rol: 'administrador',
    fechaRegistro: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    run: '22222222-2',
    nombre: 'Vendedor Principal',
    email: 'vendedor@stepstyle.cl',
    contrasena: 'vende123',
    rol: 'vendedor',
    fechaRegistro: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    run: '33333333-3',
    nombre: 'Cliente Demo',
    email: 'cliente@gmail.com',
    contrasena: 'cliente123',
    rol: 'cliente',
    genero: 'masculino',
    fechaNacimiento: '1990-01-01',
    region: 'Metropolitana de Santiago',
    comuna: 'Santiago',
    direccion: 'Calle Falsa 123',
    telefono: '+56912345678',
    fechaRegistro: '2025-01-15T00:00:00.000Z'
  }
];

// ==================== DATOS INICIALES - ARTÍCULOS BLOG ====================

export const articulosBlogIniciales = [
  {
    id: 1,
    titulo: "Tendencias de Zapatos Oxford para 2025",
    resumen: "Los clásicos Oxford reinventan la elegancia masculina.",
    categoria: "tendencias",
    fecha: "2025-10-28",
    imagen: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600",
    contenido: "Los zapatos Oxford son un clásico atemporal que nunca pasa de moda. Este 2025, los vemos reinventados con cueros de primera calidad, suelas más cómodas y diseños que combinan lo formal con lo casual. Son perfectos para la oficina, eventos importantes o simplemente para verte bien en cualquier ocasión. El secreto está en elegir un par de calidad que dure años.",
    autor: "Carlos Rodríguez"
  },
  {
    id: 2,
    titulo: "Cómo Elegir los Tacones Perfectos",
    resumen: "Guía completa para encontrar tacones elegantes y cómodos.",
    categoria: "consejos",
    fecha: "2025-10-25",
    imagen: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600",
    contenido: "Elegir tacones no solo se trata de estilo, sino también de comodidad y salud. La altura ideal del tacón depende de tu experiencia y la ocasión. Para eventos especiales, un tacón de 7-9 cm es perfecto. Busca materiales de calidad que se adapten a tu pie, plantillas acolchadas y una base estable. Recuerda que unos tacones bien elegidos pueden transformar completamente tu outfit.",
    autor: "María González"
  },
  {
    id: 3,
    titulo: "Zapatillas Deportivas: Running vs Training",
    resumen: "Conoce la diferencia y elige las zapatillas correctas.",
    categoria: "consejos",
    fecha: "2025-10-22",
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    contenido: "No todas las zapatillas deportivas son iguales. Las de running están diseñadas para movimientos hacia adelante, con amortiguación en el talón. Las de training tienen soporte lateral para movimientos multidireccionales. Si corres regularmente, invierte en unas buenas zapatillas de running con la amortiguación adecuada para tu pisada. Tu cuerpo te lo agradecerá.",
    autor: "Diego Fernández"
  },
  {
    id: 4,
    titulo: "Cuidados Esenciales para Botas de Cuero",
    resumen: "Mantén tus botas impecables temporada tras temporada.",
    categoria: "cuidado",
    fecha: "2025-10-20",
    imagen: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400",
    contenido: "Las botas de cuero son una inversión que puede durar décadas con el cuidado apropiado. Limpia el polvo después de cada uso con un paño suave. Aplica crema nutritiva cada 2-3 semanas para mantener el cuero flexible. Usa hormas cuando no las uses para mantener su forma. Impermeabiliza antes de la temporada de lluvia. Con estos cuidados simples, tus botas te acompañarán por años.",
    autor: "Ana Martínez"
  },
  {
    id: 5,
    titulo: "Sandalias de Verano: Estilo y Comodidad",
    resumen: "Las mejores sandalias para disfrutar el calor con estilo.",
    categoria: "estilo",
    fecha: "2025-10-18",
    imagen: "https://images.unsplash.com/photo-1603808033176-e2f2d3a00645?w=400",
    contenido: "Las sandalias son el calzado estrella del verano. Este año destacan las sandalias minimalistas con tiras delgadas, las plataformas cómodas y los diseños con detalles artesanales. Busca materiales que respiren como el cuero o la lona, suelas con buen agarre y ajustes que se adapten a tu pie. Las sandalias correctas te permiten caminar todo el día sin sacrificar el estilo.",
    autor: "Sofía Vargas"
  },
  {
    id: 6,
    titulo: "Zapatos Escolares: Guía para Padres",
    resumen: "Cómo elegir el calzado escolar perfecto para tus hijos.",
    categoria: "consejos",
    fecha: "2025-10-15",
    imagen: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
    contenido: "Los zapatos escolares deben ser resistentes, cómodos y permitir el correcto desarrollo del pie. Busca materiales transpirables, suelas antideslizantes y suficiente espacio en la punta (aproximadamente 1 cm). Los niños crecen rápido, así que revisa el calce cada 3-4 meses. Involucra a tus hijos en la elección para asegurar que les gusten y los usen con gusto. La comodidad es clave para su concentración en clase.",
    autor: "Patricia López"
  },
  {
    id: 7,
    titulo: "Zapatillas Casuales: El Must-Have Versátil",
    resumen: "Las zapatillas casuales que van con todo tu guardarropa.",
    categoria: "estilo",
    fecha: "2025-10-12",
    imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
    contenido: "Las zapatillas casuales son el calzado más versátil de tu closet. Combinan con jeans, vestidos, shorts y hasta outfits semi-formales. Las clásicas blancas son imprescindibles, pero no tengas miedo de experimentar con colores y texturas. Busca diseños minimalistas que no pasen de moda y materiales de calidad. Un par de buenas zapatillas casuales puede llevarte del café matutino a una cena informal sin cambiar de zapatos.",
    autor: "Luis Torres"
  },
  {
    id: 8,
    titulo: "Zapatos de Vestir para Eventos Especiales",
    resumen: "La elegancia en cada paso: guía de zapatos formales.",
    categoria: "estilo",
    fecha: "2025-10-10",
    imagen: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400",
    contenido: "Un par de zapatos de vestir de calidad es esencial para bodas, graduaciones y eventos importantes. Los Oxford y Derby son las opciones más versátiles en negro o café. El cuero genuino se adapta a tu pie y envejece elegantemente. Asegúrate de que estén bien pulidos y en perfectas condiciones. Un buen truco: usa los nuevos en casa un par de días antes del evento para ablandarlos. La comodidad y la elegancia pueden ir de la mano.",
    autor: "Roberto Silva"
  },
  {
    id: 9,
    titulo: "Materiales Sustentables en Calzado",
    resumen: "La nueva era del calzado ecológico y responsable.",
    categoria: "tendencias",
    fecha: "2025-10-08",
    imagen: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600",
    contenido: "La industria del calzado está evolucionando hacia la sostenibilidad. Cueros curtidos con procesos ecológicos, materiales reciclados, suelas biodegradables y producción ética son las nuevas tendencias. Cada vez más marcas apuestan por reducir su huella de carbono sin sacrificar calidad o estilo. Elegir calzado sustentable no solo beneficia al planeta, sino que también apoya prácticas laborales justas. El futuro de la moda es consciente.",
    autor: "Elena Morales"
  },
  {
    id: 10,
    titulo: "Cómo Limpiar Zapatillas Blancas",
    resumen: "Trucos caseros para mantener tus zapatillas impecables.",
    categoria: "cuidado",
    fecha: "2025-10-05",
    imagen: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600",
    contenido: "Las zapatillas blancas son hermosas pero difíciles de mantener. Para limpiarlas: retira los cordones y lava aparte, usa una mezcla de bicarbonato y agua para manchas difíciles, cepilla suavemente con un cepillo de dientes viejo, limpia las suelas con jabón y un cepillo duro. Para secar, rellena con papel y deja al aire (nunca al sol directo). Limpia después de cada 3-4 usos para evitar que la suciedad se fije. ¡Parecerán nuevas por mucho tiempo!",
    autor: "Carmen Ruiz"
  },
  {
    id: 11,
    titulo: "La Importancia del Calce Correcto",
    resumen: "Por qué usar la talla correcta cambia todo.",
    categoria: "consejos",
    fecha: "2025-10-02",
    imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
    contenido: "Usar la talla incorrecta puede causar ampollas, dolor de espalda y problemas a largo plazo. El pie cambia de tamaño durante el día (es más grande por la tarde), así que prueba zapatos en ese horario. Debe haber espacio de un dedo entre tu dedo más largo y la punta del zapato. El talón no debe salirse al caminar. Si dudas entre dos tallas, elige la mayor. Recuerda que cada marca calza diferente, así que siempre prueba antes de comprar.",
    autor: "Dr. Andrés Campos"
  },
  {
    id: 12,
    titulo: "Tendencia: Botas Chunky para el Invierno",
    resumen: "Las botas gruesas que dominan el street style.",
    categoria: "tendencias",
    fecha: "2025-09-30",
    imagen: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600",
    contenido: "Las botas chunky o de plataforma gruesa son la tendencia del momento. Combinan actitud, comodidad y un toque retro-futurista. Son perfectas para enfrentar el invierno con estilo, dándole un giro moderno a cualquier outfit. Combínalas con vestidos, jeans o leggings. La clave está en balancear la proporción: si las botas son voluminosas, mantén el resto del outfit más ajustado. Atrévete a experimentar con este look audaz.",
    autor: "Valentina Castro"
  }
];

// ==================== REGIONES Y COMUNAS DE CHILE ====================

export const regionesComunas = [
  {
    value: "Metropolitana de Santiago",
    label: "Metropolitana de Santiago",
    comunas: [
      { value: "Santiago", label: "Santiago" },
      { value: "Providencia", label: "Providencia" },
      { value: "Las Condes", label: "Las Condes" },
      { value: "Ñuñoa", label: "Ñuñoa" },
      { value: "Maipú", label: "Maipú" },
      { value: "La Florida", label: "La Florida" },
      { value: "Puente Alto", label: "Puente Alto" }
    ]
  },
  {
    value: "Valparaíso",
    label: "Valparaíso",
    comunas: [
      { value: "Valparaíso", label: "Valparaíso" },
      { value: "Viña del Mar", label: "Viña del Mar" },
      { value: "Quilpué", label: "Quilpué" },
      { value: "Villa Alemana", label: "Villa Alemana" }
    ]
  },
  {
    value: "Biobío",
    label: "Biobío",
    comunas: [
      { value: "Concepción", label: "Concepción" },
      { value: "Talcahuano", label: "Talcahuano" },
      { value: "Los Ángeles", label: "Los Ángeles" },
      { value: "Chillán", label: "Chillán" }
    ]
  }
];

// ==================== FUNCIONES DE INICIALIZACIÓN ====================

/**
 * Inicializa el localStorage con datos por defecto si no existen
 */
export const inicializarDatos = () => {
  // Inicializar productos
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTOS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productosIniciales));
  }

  // Inicializar usuarios
  if (!localStorage.getItem(STORAGE_KEYS.USUARIOS)) {
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuariosIniciales));
  }

  // Inicializar artículos blog
  if (!localStorage.getItem(STORAGE_KEYS.ARTICULOS_BLOG)) {
    localStorage.setItem(STORAGE_KEYS.ARTICULOS_BLOG, JSON.stringify(articulosBlogIniciales));
  }

  // Inicializar arrays vacíos para contactos y pedidos
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTOS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTOS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PEDIDOS)) {
    localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify([]));
  }

  // Inicializar carrito vacío
  if (!localStorage.getItem(STORAGE_KEYS.CARRITO)) {
    localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify([]));
  }
};

/**
 * Resetea todos los datos a su estado inicial
 */
export const resetearDatos = () => {
  localStorage.clear();
  inicializarDatos();
};

// ==================== CRUD - PRODUCTOS ====================

/**
 * LEER: Obtiene todos los productos
 * @returns {Array} Array de productos
 */
export const obtenerProductos = () => {
  const productos = localStorage.getItem(STORAGE_KEYS.PRODUCTOS);
  return productos ? JSON.parse(productos) : [];
};

/**
 * LEER: Obtiene un producto por su ID
 * @param {number} id - ID del producto
 * @returns {Object|undefined} Producto encontrado o undefined
 */
export const obtenerProductoPorId = (id) => {
  const productos = obtenerProductos();
  return productos.find(p => p.id === id);
};

/**
 * LEER: Obtiene productos destacados
 * @returns {Array} Array de productos destacados con stock disponible
 */
export const obtenerProductosDestacados = () => {
  const productos = obtenerProductos();
  return productos.filter(p => {
    if (!p.destacado) return false;
    // Verificar si hay al menos una talla con stock
    if (p.stockPorTalla && p.stockPorTalla.length > 0) {
      return p.stockPorTalla.some(st => st.stock > 0);
    }
    return false;
  });
};

/**
 * LEER: Filtra productos por categoría
 * @param {string} categoria - Categoría a filtrar ('todos', 'hombre', 'mujer', 'niños', 'deportivos')
 * @returns {Array} Array de productos filtrados
 */
export const filtrarProductosPorCategoria = (categoria) => {
  const productos = obtenerProductos();
  if (categoria === 'todos') return productos;
  return productos.filter(p => p.categoria === categoria);
};

/**
 * CREAR: Crea un nuevo producto
 * @param {Object} producto - Datos del producto (sin id)
 * @returns {Object} Producto creado con id asignado
 */
export const crearProducto = (producto) => {
  const productos = obtenerProductos();
  const nuevoId = Math.max(0, ...productos.map(p => p.id)) + 1;
  const nuevoProducto = { ...producto, id: nuevoId };
  productos.push(nuevoProducto);
  localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
  return nuevoProducto;
};

/**
 * ACTUALIZAR: Actualiza un producto existente
 * @param {number} id - ID del producto a actualizar
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {boolean} true si se actualizó, false si no existe
 */
export const actualizarProducto = (id, datosActualizados) => {
  const productos = obtenerProductos();
  const indice = productos.findIndex(p => p.id === id);
  
  if (indice === -1) return false;
  
  productos[indice] = { ...productos[indice], ...datosActualizados };
  localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
  return true;
};

/**
 * ELIMINAR: Elimina un producto
 * @param {number} id - ID del producto a eliminar
 * @returns {boolean} true si se eliminó, false si no existe
 */
export const eliminarProducto = (id) => {
  const productos = obtenerProductos();
  const productosFiltrados = productos.filter(p => p.id !== id);
  
  if (productos.length === productosFiltrados.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productosFiltrados));
  return true;
};

/**
 * ACTUALIZAR: Actualiza el stock de un producto (OBSOLETO - usar stockPorTalla)
 * Esta función ya no se utiliza. El stock ahora se maneja por talla individual.
 * @deprecated Usar actualizarProducto con stockPorTalla array
 */

// ==================== CRUD - USUARIOS ====================

/**
 * LEER: Obtiene todos los usuarios
 * @returns {Array} Array de usuarios
 */
export const obtenerUsuarios = () => {
  const usuarios = localStorage.getItem(STORAGE_KEYS.USUARIOS);
  return usuarios ? JSON.parse(usuarios) : [];
};

/**
 * LEER: Obtiene un usuario por email
 * @param {string} email - Email del usuario
 * @returns {Object|undefined} Usuario encontrado o undefined
 */
export const obtenerUsuarioPorEmail = (email) => {
  const usuarios = obtenerUsuarios();
  return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
};

/**
 * LEER: Obtiene un usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Object|undefined} Usuario encontrado o undefined
 */
export const obtenerUsuarioPorId = (id) => {
  const usuarios = obtenerUsuarios();
  return usuarios.find(u => u.id === id);
};

/**
 * CREAR: Crea un nuevo usuario
 * @param {Object} usuario - Datos del usuario (sin id y fechaRegistro)
 * @returns {Object} Usuario creado
 * @throws {Error} Si el email ya está registrado
 */
export const crearUsuario = (usuario) => {
  const usuarios = obtenerUsuarios();
  
  // Verificar si el email ya existe
  if (usuarios.some(u => u.email.toLowerCase() === usuario.email.toLowerCase())) {
    throw new Error('El email ya está registrado');
  }

  const nuevoId = (usuarios.length + 1).toString();
  const nuevoUsuario = {
    ...usuario,
    id: nuevoId,
    fechaRegistro: new Date().toISOString()
  };
  
  usuarios.push(nuevoUsuario);
  localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
  return nuevoUsuario;
};

/**
 * ACTUALIZAR: Actualiza un usuario existente
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {boolean} true si se actualizó, false si no existe
 */
export const actualizarUsuario = (id, datosActualizados) => {
  const usuarios = obtenerUsuarios();
  const indice = usuarios.findIndex(u => u.id === id);
  
  if (indice === -1) return false;
  
  usuarios[indice] = { ...usuarios[indice], ...datosActualizados };
  localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
  return true;
};

/**
 * ELIMINAR: Elimina un usuario
 * @param {string} id - ID del usuario a eliminar
 * @returns {boolean} true si se eliminó, false si no existe
 */
export const eliminarUsuario = (id) => {
  const usuarios = obtenerUsuarios();
  const usuariosFiltrados = usuarios.filter(u => u.id !== id);
  
  if (usuarios.length === usuariosFiltrados.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuariosFiltrados));
  return true;
};

// ==================== CRUD - ARTÍCULOS BLOG ====================

/**
 * LEER: Obtiene todos los artículos del blog
 * @returns {Array} Array de artículos
 */
export const obtenerArticulosBlog = () => {
  const articulos = localStorage.getItem(STORAGE_KEYS.ARTICULOS_BLOG);
  return articulos ? JSON.parse(articulos) : [];
};

/**
 * LEER: Obtiene un artículo por ID
 * @param {number} id - ID del artículo
 * @returns {Object|undefined} Artículo encontrado o undefined
 */
export const obtenerArticuloPorId = (id) => {
  const articulos = obtenerArticulosBlog();
  return articulos.find(a => a.id === id);
};

/**
 * LEER: Filtra artículos por categoría
 * @param {string} categoria - Categoría a filtrar
 * @returns {Array} Array de artículos filtrados
 */
export const filtrarArticulosPorCategoria = (categoria) => {
  const articulos = obtenerArticulosBlog();
  if (categoria === 'todos') return articulos;
  return articulos.filter(a => a.categoria === categoria);
};

/**
 * CREAR: Crea un nuevo artículo de blog
 * @param {Object} articulo - Datos del artículo (sin id)
 * @returns {Object} Artículo creado con id asignado
 */
export const crearArticuloBlog = (articulo) => {
  const articulos = obtenerArticulosBlog();
  const nuevoId = Math.max(0, ...articulos.map(a => a.id)) + 1;
  const nuevoArticulo = { ...articulo, id: nuevoId };
  articulos.push(nuevoArticulo);
  localStorage.setItem(STORAGE_KEYS.ARTICULOS_BLOG, JSON.stringify(articulos));
  return nuevoArticulo;
};

/**
 * ACTUALIZAR: Actualiza un artículo existente
 * @param {number} id - ID del artículo a actualizar
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {boolean} true si se actualizó, false si no existe
 */
export const actualizarArticuloBlog = (id, datosActualizados) => {
  const articulos = obtenerArticulosBlog();
  const indice = articulos.findIndex(a => a.id === id);
  
  if (indice === -1) return false;
  
  articulos[indice] = { ...articulos[indice], ...datosActualizados };
  localStorage.setItem(STORAGE_KEYS.ARTICULOS_BLOG, JSON.stringify(articulos));
  return true;
};

/**
 * ELIMINAR: Elimina un artículo
 * @param {number} id - ID del artículo a eliminar
 * @returns {boolean} true si se eliminó, false si no existe
 */
export const eliminarArticuloBlog = (id) => {
  const articulos = obtenerArticulosBlog();
  const articulosFiltrados = articulos.filter(a => a.id !== id);
  
  if (articulos.length === articulosFiltrados.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.ARTICULOS_BLOG, JSON.stringify(articulosFiltrados));
  return true;
};

// ==================== CRUD - CONTACTOS ====================

/**
 * LEER: Obtiene todos los contactos
 * @returns {Array} Array de mensajes de contacto
 */
export const obtenerContactos = () => {
  const contactos = localStorage.getItem(STORAGE_KEYS.CONTACTOS);
  return contactos ? JSON.parse(contactos) : [];
};

/**
 * CREAR: Guarda un nuevo mensaje de contacto
 * @param {Object} contacto - Datos del contacto (sin fecha)
 * @returns {Object} Contacto creado con fecha asignada
 */
export const guardarContacto = (contacto) => {
  const contactos = obtenerContactos();
  const nuevoContacto = {
    ...contacto,
    fecha: new Date().toISOString()
  };
  contactos.push(nuevoContacto);
  localStorage.setItem(STORAGE_KEYS.CONTACTOS, JSON.stringify(contactos));
  return nuevoContacto;
};

/**
 * ELIMINAR: Elimina un mensaje de contacto por índice
 * @param {number} indice - Índice del contacto a eliminar
 * @returns {boolean} true si se eliminó, false si no existe
 */
export const eliminarContacto = (indice) => {
  const contactos = obtenerContactos();
  
  if (indice < 0 || indice >= contactos.length) return false;
  
  contactos.splice(indice, 1);
  localStorage.setItem(STORAGE_KEYS.CONTACTOS, JSON.stringify(contactos));
  return true;
};

// ==================== CRUD - PEDIDOS ====================

/**
 * LEER: Obtiene todos los pedidos
 * @returns {Array} Array de pedidos
 */
export const obtenerPedidos = () => {
  const pedidos = localStorage.getItem(STORAGE_KEYS.PEDIDOS);
  return pedidos ? JSON.parse(pedidos) : [];
};

/**
 * LEER: Obtiene pedidos de un usuario específico
 * @param {string} usuarioId - ID del usuario
 * @returns {Array} Array de pedidos del usuario
 */
export const obtenerPedidosPorUsuario = (usuarioId) => {
  const pedidos = obtenerPedidos();
  return pedidos.filter(p => p.usuarioId === usuarioId);
};

/**
 * LEER: Obtiene un pedido por ID
 * @param {string} id - ID del pedido
 * @returns {Object|undefined} Pedido encontrado o undefined
 */
export const obtenerPedidoPorId = (id) => {
  const pedidos = obtenerPedidos();
  return pedidos.find(p => p.id === id);
};

/**
 * CREAR: Crea un nuevo pedido
 * @param {Object} pedido - Datos del pedido (sin id y fecha)
 * @returns {Object} Pedido creado con id y fecha asignados
 */
export const crearPedido = (pedido) => {
  const pedidos = obtenerPedidos();
  const nuevoId = `PED-${Date.now()}`;
  const nuevoPedido = {
    ...pedido,
    id: nuevoId,
    fecha: new Date().toISOString()
  };
  pedidos.push(nuevoPedido);
  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
  return nuevoPedido;
};

/**
 * ACTUALIZAR: Actualiza el estado de un pedido
 * @param {string} id - ID del pedido
 * @param {string} estado - Nuevo estado ('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado')
 * @returns {boolean} true si se actualizó, false si no existe
 */
export const actualizarEstadoPedido = (id, estado) => {
  const pedidos = obtenerPedidos();
  const indice = pedidos.findIndex(p => p.id === id);
  
  if (indice === -1) return false;
  
  pedidos[indice].estado = estado;
  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
  return true;
};

/**
 * ACTUALIZAR: Actualiza un pedido completo
 * @param {string} id - ID del pedido a actualizar
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {boolean} true si se actualizó, false si no existe
 */
export const actualizarPedido = (id, datosActualizados) => {
  const pedidos = obtenerPedidos();
  const indice = pedidos.findIndex(p => p.id === id);
  
  if (indice === -1) return false;
  
  pedidos[indice] = { ...pedidos[indice], ...datosActualizados };
  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
  return true;
};

/**
 * ELIMINAR: Elimina un pedido
 * @param {string} id - ID del pedido a eliminar
 * @returns {boolean} true si se eliminó, false si no existe
 */
export const eliminarPedido = (id) => {
  const pedidos = obtenerPedidos();
  const pedidosFiltrados = pedidos.filter(p => p.id !== id);
  
  if (pedidos.length === pedidosFiltrados.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
  return true;
};

// ==================== FUNCIONES DE UTILIDAD ====================

/**
 * Obtiene las claves de almacenamiento
 * @returns {Object} Objeto con las claves de localStorage
 */
export const getStorageKeys = () => STORAGE_KEYS;

/**
 * Exporta todos los datos del sistema
 * @returns {Object} Objeto con todos los datos
 */
export const exportarDatos = () => {
  return {
    productos: obtenerProductos(),
    usuarios: obtenerUsuarios(),
    articulos: obtenerArticulosBlog(),
    contactos: obtenerContactos(),
    pedidos: obtenerPedidos()
  };
};

/**
 * Importa datos al sistema (sobrescribe datos existentes)
 * @param {Object} datos - Objeto con los datos a importar
 */
export const importarDatos = (datos) => {
  if (datos.productos) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(datos.productos));
  }
  if (datos.usuarios) {
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(datos.usuarios));
  }
  if (datos.articulos) {
    localStorage.setItem(STORAGE_KEYS.ARTICULOS_BLOG, JSON.stringify(datos.articulos));
  }
  if (datos.contactos) {
    localStorage.setItem(STORAGE_KEYS.CONTACTOS, JSON.stringify(datos.contactos));
  }
  if (datos.pedidos) {
    localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(datos.pedidos));
  }
};

/**
 * Obtiene estadísticas del sistema
 * @returns {Object} Objeto con estadísticas
 */
export const obtenerEstadisticas = () => {
  return {
    totalProductos: obtenerProductos().length,
    totalUsuarios: obtenerUsuarios().length,
    totalArticulos: obtenerArticulosBlog().length,
    totalContactos: obtenerContactos().length,
    totalPedidos: obtenerPedidos().length,
    productosDestacados: obtenerProductosDestacados().length,
    productosSinStock: obtenerProductos().filter(p => {
      // Verificar si todas las tallas tienen stock 0
      if (p.stockPorTalla && p.stockPorTalla.length > 0) {
        return p.stockPorTalla.every(st => st.stock === 0);
      }
      return true; // Si no hay stockPorTalla, considerarlo sin stock
    }).length
  };
};
