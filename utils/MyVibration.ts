import * as Haptics from "expo-haptics";
import {ImpactFeedbackStyle} from "expo-haptics";

export default {
    vibrateDevice(impactStyle: ImpactFeedbackStyle) {
        Haptics.impactAsync(impactStyle)
    }
}
