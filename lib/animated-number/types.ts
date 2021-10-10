export interface AnimatedNumber {
  current: number
  velocity: number
  lastIdealValue: number
  lastIdealVelocity: number
}

export interface Spring {
  val: number
  stiffness: number
  damping: number
  precision: number
}

export interface SpringHelperConfig {
  stiffness?: number
  damping?: number
  precision?: number
}

export interface OpaqueConfig {
  val: number
  stiffness: number
  damping: number
  precision: number
}
