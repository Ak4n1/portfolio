// Módulo de animaciones para el Hero Canvas V2
// Contiene todas las animaciones relacionadas con la cuadrícula

export interface AnimationConfig {
  duration: number;        // Duración de la animación en ms
  delay: number;           // Delay antes de iniciar en ms
  easing: string;          // Tipo de easing
  stagger: number;         // Delay entre elementos en ms
}

export interface TextAnimationConfig extends AnimationConfig {
  text: string;            // Texto a animar
  direction: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
  revealStyle: 'fade' | 'slide' | 'scale' | 'wave';
}

export interface GridRevealConfig extends AnimationConfig {
  pattern: 'random' | 'spiral' | 'wave' | 'diagonal' | 'rows' | 'columns';
  startPosition: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Configuración por defecto para animación de texto
export const DEFAULT_TEXT_ANIMATION: TextAnimationConfig = {
  text: 'JUAN ENCABO',
  duration: 3000,
  delay: 500,
  easing: 'ease-out',
  stagger: 30,
  direction: 'left-to-right',
  revealStyle: 'fade'
};

// Configuración por defecto para revelación de cuadrícula
export const DEFAULT_GRID_REVEAL: GridRevealConfig = {
  duration: 1500,
  delay: 0,
  easing: 'ease-out',
  stagger: 10,
  pattern: 'random',
  startPosition: 'center'
};

// Función de easing
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function easeIn(t: number): number {
  return t * t;
}

// Mapeo de funciones de easing
export const EASING_FUNCTIONS: { [key: string]: (t: number) => number } = {
  'linear': (t: number) => t,
  'ease-in': easeIn,
  'ease-out': easeOut,
  'ease-in-out': easeInOut
};

// Utilidades para calcular posiciones de inicio según el patrón
export function getStartPosition(
  rows: number,
  cols: number,
  startPosition: string
): { row: number; col: number } {
  switch (startPosition) {
    case 'top-left':
      return { row: 0, col: 0 };
    case 'top-right':
      return { row: 0, col: cols - 1 };
    case 'bottom-left':
      return { row: rows - 1, col: 0 };
    case 'bottom-right':
      return { row: rows - 1, col: cols - 1 };
    case 'center':
    default:
      return { row: Math.floor(rows / 2), col: Math.floor(cols / 2) };
  }
}

// Calcular orden de revelación según el patrón
export function calculateRevealOrder(
  rows: number,
  cols: number,
  pattern: string,
  startPosition: string
): number[] {
  const start = getStartPosition(rows, cols, startPosition);
  const order: number[] = [];
  const visited = new Set<number>();

  switch (pattern) {
    case 'spiral':
      return calculateSpiralOrder(rows, cols, start.row, start.col);
    case 'wave':
      return calculateWaveOrder(rows, cols, start.row);
    case 'diagonal':
      return calculateDiagonalOrder(rows, cols);
    case 'rows':
      return calculateRowsOrder(rows, cols);
    case 'columns':
      return calculateColumnsOrder(rows, cols);
    case 'random':
    default:
      return calculateRandomOrder(rows, cols);
  }
}

function calculateSpiralOrder(rows: number, cols: number, startRow: number, startCol: number): number[] {
  const order: number[] = [];
  const visited = new Set<number>();
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
  let direction = 0;
  let row = startRow;
  let col = startCol;
  let steps = 1;
  let stepCount = 0;

  while (order.length < rows * cols) {
    for (let i = 0; i < steps; i++) {
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        const index = row * cols + col;
        if (!visited.has(index)) {
          order.push(index);
          visited.add(index);
        }
      }
      row += directions[direction][0];
      col += directions[direction][1];
    }
    direction = (direction + 1) % 4;
    stepCount++;
    if (stepCount % 2 === 0) {
      steps++;
    }
  }

  return order;
}

function calculateWaveOrder(rows: number, cols: number, startRow: number): number[] {
  const order: number[] = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const index = row * cols + col;
      order.push(index);
    }
  }
  return order;
}

function calculateDiagonalOrder(rows: number, cols: number): number[] {
  const order: number[] = [];
  for (let sum = 0; sum < rows + cols - 1; sum++) {
    for (let row = 0; row < rows; row++) {
      const col = sum - row;
      if (col >= 0 && col < cols) {
        order.push(row * cols + col);
      }
    }
  }
  return order;
}

function calculateRowsOrder(rows: number, cols: number): number[] {
  const order: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      order.push(row * cols + col);
    }
  }
  return order;
}

function calculateColumnsOrder(rows: number, cols: number): number[] {
  const order: number[] = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      order.push(row * cols + col);
    }
  }
  return order;
}

function calculateRandomOrder(rows: number, cols: number): number[] {
  const order: number[] = [];
  for (let i = 0; i < rows * cols; i++) {
    order.push(i);
  }
  // Shuffle array
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// Definiciones de letras como matrices (8 filas x 5 columnas) - versión original
// 1 = cuadrado iluminado, 0 = cuadrado vacío
export const LETTER_MATRICES: { [key: string]: number[][] } = {
  'J': [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  'U': [
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
  ],
  'A': [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0]
  ],
  'N': [
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0]
  ],
  'E': [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0], // Palo medio centrado
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0]
  ],
  'C': [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
  ],
  'B': [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
  ],
  'O': [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
  ],
  ' ': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
};

// Ancho de cada letra en cuadrados (incluyendo espacio entre letras)
const LETTER_WIDTH = 5;
const LETTER_SPACING = 2; // Espacio entre letras
const SPACE_AFTER_J = 0;  // Entre J y U menos espacio (2 columnas menos que el resto)
const SPACE_BETWEEN_WORDS = 3; // Entre JUAN y ENCABO (las 2 columnas que sacamos de J-U)

function getSpaceAfterLetter(char: string): number {
  return char === 'J' ? SPACE_AFTER_J : LETTER_SPACING;
}

// Calcular posiciones de texto usando matrices de letras
export function calculateTextPositions(
  text: string,
  gridCols: number,
  gridRows: number,
  squareSize: number,
  direction: string
): Array<{ row: number; col: number; char: string }> {
  const positions: Array<{ row: number; col: number; char: string }> = [];
  
  // Calcular posición vertical centrada (centro de la cuadrícula menos mitad de altura de letra)
  const letterHeight = 8; // Altura de las matrices de letras (8 filas)
  const centerRow = Math.floor(gridRows / 2);
  const startRow = centerRow - Math.floor(letterHeight / 2);
  
  // Calcular ancho total del texto
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    if (char === ' ') {
      totalWidth += SPACE_BETWEEN_WORDS;
    } else if (LETTER_MATRICES[char]) {
      totalWidth += LETTER_WIDTH;
      if (i < text.length - 1 && text[i + 1] !== ' ') {
        totalWidth += getSpaceAfterLetter(char);
      }
    }
  }
  
  // Calcular posición inicial horizontal para centrar
  const startCol = Math.max(0, Math.floor((gridCols - totalWidth) / 2));
  
  let currentCol = startCol;
  
  // Procesar cada carácter del texto
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    
    if (char === ' ') {
      // Espacio entre palabras (más cerrado que entre letras)
      currentCol += SPACE_BETWEEN_WORDS;
      continue;
    }
    
    const matrix = LETTER_MATRICES[char];
    if (!matrix) {
      continue; // Saltar caracteres no definidos
    }
    
    // Dibujar la letra usando su matriz
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === 1) {
          const gridRow = startRow + row;
          const gridCol = currentCol + col;
          
          // Verificar que esté dentro de los límites
          if (gridRow >= 0 && gridRow < gridRows && gridCol >= 0 && gridCol < gridCols) {
            positions.push({
              row: gridRow,
              col: gridCol,
              char: char
            });
          }
        }
      }
    }
    
    // Avanzar a la siguiente posición (letra + espacio; después de J menos espacio)
    const nextChar = i + 1 < text.length ? text[i + 1].toUpperCase() : '';
    const spaceAfter = nextChar === ' ' ? 0 : getSpaceAfterLetter(char);
    currentCol += LETTER_WIDTH + spaceAfter;
  }
  
  return positions;
}

