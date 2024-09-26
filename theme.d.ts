import { MyColorScheme } from './styles/Colors';  // Importe a interface do esquema de cores que você criou
import 'styled-components/native';  // Importe o módulo do styled-components
// // Declare o módulo para sobrecarregar a tipagem do styled-components
// declare module 'styled-components' {
//     export interface DefaultTheme extends MyColorScheme {}  // Extenda a interface padrão para incluir seu tema
// }

declare module 'styled-components/native' {
    export interface DefaultTheme extends MyColorScheme {}
}