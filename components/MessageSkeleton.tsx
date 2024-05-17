import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import {Dimensions, View} from "react-native";

const {width} = Dimensions.get('window');

export function MessageSkeleton() {
    return (

            <SkeletonPlaceholder
                backgroundColor="#202020"  // Fundo do placeholder
                highlightColor="#333333"  // Cor da animação
                speed={1000}
            >
                <SkeletonPlaceholder.Item flexDirection={'column'} alignItems={'flex-start'}  paddingLeft={10} marginTop={15} marginBottom={20}>
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" paddingBottom={10} alignSelf={'flex-start'}>
                        <SkeletonPlaceholder.Item width={30} height={30} borderRadius={25}/>
                        <SkeletonPlaceholder.Item width={120} height={20} marginLeft={10} borderRadius={20}/>
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item borderRadius={10} width={width * 0.88} height={100} padding={10}/>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
    );
}