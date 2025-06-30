import defaultMode from './default'
import resetMode from './reset'

const modes: { [key: string]: any } = {
  default: defaultMode,
  reset: resetMode
}

export default modes
