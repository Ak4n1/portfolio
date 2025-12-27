// Interfaces de configuración para el HeroCanvas
export interface HeroCanvasConfig {
  colors: ColorConfig;
  animations: AnimationConfig;
  effects: EffectConfig;
  particles: ParticleConfig;
  buttons: ButtonConfig;
  text: TextConfig;
}

export interface ColorConfig {
  dark: ThemeColors;
  light: ThemeColors;
}

export interface ThemeColors {
  primaryButton: ButtonColors;
  secondaryButton: ButtonColors;
  text: TextColors;
  particles: ParticleColors;
}

export interface ButtonColors {
  background: string[];  // Gradiente [hover, normal, mid, dark]
  border: string[];      // Gradiente [start, mid, end]
  shadow: string;        // Color de sombra con placeholder {intensity}
  shadowIntensity: number;
}

export interface TextColors {
  primary: string;       // Color del nombre principal
  secondary: string;     // Color del saludo
  description: string;   // Color de la descripción
  buttonText: string;    // Color del texto de botones
  buttonTextShadow: string; // Color de sombra del texto
}

export interface ParticleColors {
  primary: string;       // Color primario de partículas
  secondary: string;     // Color secundario
  meteor: string;        // Color del meteorito
}

export interface AnimationConfig {
  textEntrance: {
    duration: number;    // Duración animación entrada texto (ms)
    delay: number;       // Delay antes de comenzar (ms)
    easing: string;      // Tipo de easing
  };
  buttonEntrance: {
    duration: number;    // Duración animación entrada botones (ms)
    delay: number;       // Delay antes de comenzar (ms)
    slideDistance: number; // Distancia del slide (px)
  };
  continuous: {
    speed: number;       // Velocidad animación continua
    amplitude: number;   // Amplitud del movimiento
    frequency: number[]; // Frecuencias de las ondas
  };
  hover: {
    scale: number;       // Escala en hover
    offsetAmplitude: number; // Amplitud del movimiento en hover
    glowIntensity: number;   // Intensidad del brillo en hover
  };
}

export interface EffectConfig {
  shadows: {
    blur: { normal: number; hover: number };   // Blur de sombras
    offset: { normal: number; hover: number }; // Offset de sombras
  };
  borders: {
    width: { normal: number; hover: number };  // Grosor de bordes
  };
  liquid: {
    points: number;        // Número de puntos del perímetro
    padding: number;       // Padding (negativo = más grande)
    waveAmplitudes: number[]; // Amplitudes de las ondas [wave1, wave2, wave3, wave4]
    collisionRadius: number;  // Radio de influencia del meteorito
    collisionStrength: number; // Fuerza del empuje del meteorito
  };
}

export interface ParticleConfig {
  heartbeat: {
    count: number;         // Número máximo de partículas
    spawnRate: number;     // Velocidad de generación
    maxLife: number;       // Vida máxima (ms)
    sizeRange: [number, number]; // Rango de tamaños [min, max]
    speedRange: [number, number]; // Rango de velocidades [min, max]
  };
  meteor: {
    radius: number;        // Radio del meteorito
    trailLength: number;   // Longitud de la estela
    smoothing: number;     // Suavizado del movimiento
  };
}

export interface ButtonConfig {
  dimensions: {
    primary: { width: number; height: number };   // Dimensiones botón primario
    secondary: { width: number; height: number }; // Dimensiones botón secundario
  };
  spacing: {
    separation: number;    // Separación entre botones (px)
    verticalOffset: number; // Offset vertical desde el texto (px)
  };
  typography: {
    fontSize: { normal: number; hover: number };     // Tamaños de fuente
    fontWeight: { primary: string; secondary: string }; // Pesos de fuente
  };
}

export interface TextConfig {
  meteor: {
    radius: number;        // Radio de influencia del meteorito en texto
    updateInterval: number; // Intervalo de actualización (ms)
    scaleMultiplier: number; // Multiplicador de escala en colisión
    lerpSpeed: number;     // Velocidad de interpolación
  };
  continuous: {
    floatAmplitude: number;  // Amplitud del flotado
    breathingScale: number;  // Escala del efecto breathing
    frequencies: number[];   // Frecuencias de las ondas continuas
  };
}

// ============================================================================
// CONFIGURACIONES PREDEFINIDAS
// ============================================================================

// Configuración por defecto (actual)
export const DEFAULT_CONFIG: HeroCanvasConfig = {
  colors: {
    dark: {
      primaryButton: {
        background: ['#01F3BA', '#01E5AC', '#01D69E', '#01C890'],
        border: ['rgba(1, 243, 186, 0.9)', 'rgba(1, 229, 172, 0.6)', 'rgba(1, 214, 158, 0.4)'],
        shadow: 'rgba(1, 243, 186, {intensity})',
        shadowIntensity: 1
      },
      secondaryButton: {
        background: ['#ffffff', '#f8f9fa', '#f1f3f4', '#e8eaed'],
        border: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
        shadow: 'rgba(0, 0, 0, {intensity})',
        shadowIntensity: 0.3
      },
      text: {
        primary: '#fff',
        secondary: '#ccc',
        description: '#aaa',
        buttonText: '#000000',
        buttonTextShadow: 'rgba(1, 243, 186, 0.5)'
      },
      particles: {
        primary: '#01F3BA',
        secondary: '#38bdf8',
        meteor: '#ffffff'
      }
    },
    light: {
      primaryButton: {
        background: ['#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A'],
        border: ['rgba(255, 255, 255, 0.48)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)'],
        shadow: 'rgba(255, 255, 255, {intensity})',
        shadowIntensity: 1
      },
      secondaryButton: {
        background: ['#ffffff', '#f8f9fa', '#f1f3f4', '#e8eaed'],
        border: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
        shadow: 'rgba(0, 0, 0, {intensity})',
        shadowIntensity: 0.3
      },
      text: {
        primary:'#F8312F',
        secondary: '#555',
        description: '#666',
        buttonText: '#000000',
        buttonTextShadow: 'rgba(1, 243, 187, 0)'
      },
      particles: {
        primary: '#01F3BA',
        secondary: '#0ea5e9',
        meteor: '#333333'
      }
    }
  },
  animations: {
    textEntrance: {
      duration: 2000,
      delay: 0,
      easing: 'ease-out'
    },
    buttonEntrance: {
      duration: 1500,
      delay: 1300,
      slideDistance: 30
    },
    continuous: {
      speed: 0.008,
      amplitude: 2,
      frequency: [1.2, 2.1, 0.7, 1.3]
    },
    hover: {
      scale: 1.12,
      offsetAmplitude: 3,
      glowIntensity: 0.9
    }
  },
  effects: {
    shadows: {
      blur: { normal: 25, hover: 45 },
      offset: { normal: 6, hover: 10 }
    },
    borders: {
      width: { normal: 3, hover: 4 }
    },
    liquid: {
      points: 20,
      padding: -5,
      waveAmplitudes: [0.08, 0.05, 0.03, 0.06],
      collisionRadius: 15,
      collisionStrength: 25
    }
  },
  particles: {
    heartbeat: {
      count: 50,
      spawnRate: 0.3,
      maxLife: 3000,
      sizeRange: [1, 4],
      speedRange: [0.5, 2]
    },
    meteor: {
      radius: 20,
      trailLength: 25,
      smoothing: 0.15
    }
  },
  buttons: {
    dimensions: {
      primary: { width: 170, height: 60 },
      secondary: { width: 150, height: 60 }
    },
    spacing: {
      separation: 220,
      verticalOffset: 150
    },
    typography: {
      fontSize: { normal: 20, hover: 22 },
      fontWeight: { primary: 'bold', secondary: '600' }
    }
  },
  text: {
    meteor: {
      radius: 40,
      updateInterval: 100,
      scaleMultiplier: 0.8,
      lerpSpeed: 0.15
    },
    continuous: {
      floatAmplitude: 2.8,
      breathingScale: 0.023,
      frequencies: [1.2, 2.1, 0.7, 1.3]
    }
  }
};

