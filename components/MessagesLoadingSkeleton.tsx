import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import {Dimensions, View} from "react-native";

const {width} = Dimensions.get('window');

export function MessagesLoadingSkeleton() {
    return (
        <SkeletonPlaceholder
            backgroundColor="#202020"  // Cor de fundo do placeholder
            highlightColor="#333333"   // Cor do destaque na animação
            speed={1000}               // Velocidade da animação
        >
            <SkeletonPlaceholder.Item flexDirection="column" alignItems="flex-start" paddingHorizontal={15} marginTop={15} marginBottom={5} width={width}>
                <SkeletonPlaceholder.Item alignSelf="flex-end" marginBottom={10}>
                    <SkeletonPlaceholder.Item
                        width={60}
                        height={25}
                        borderRadius={20}
                        marginBottom={6}
                    />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item alignSelf="flex-end" marginLeft={10} marginBottom={10}>
                    <SkeletonPlaceholder.Item
                        width={width * 0.75}
                        height={50}
                        borderRadius={15}
                        marginBottom={6}
                    />
                </SkeletonPlaceholder.Item>

                <SkeletonPlaceholder.Item alignSelf="flex-start" flexDirection={'row'} gap={10} marginRight={10} marginBottom={10}>
                    <SkeletonPlaceholder.Item
                        width={30}
                        height={30}
                        borderRadius={30}
                        marginBottom={6}
                    />
                    <SkeletonPlaceholder.Item
                        width={70}
                        height={25}
                        borderRadius={30}
                        marginBottom={6}
                        alignSelf={'center'}
                    />
                </SkeletonPlaceholder.Item>

                <SkeletonPlaceholder.Item alignSelf="flex-start" marginBottom={10}>
                    <SkeletonPlaceholder.Item
                        width={width * 0.75}
                        height={200}
                        borderRadius={15}
                        marginBottom={6}
                    />
                </SkeletonPlaceholder.Item>

                {/*<SkeletonPlaceholder.Item alignSelf="flex-end" marginBottom={10}>*/}
                {/*    <SkeletonPlaceholder.Item*/}
                {/*        width={60}*/}
                {/*        height={25}*/}
                {/*        borderRadius={20}*/}
                {/*        marginBottom={6}*/}
                {/*    />*/}
                {/*</SkeletonPlaceholder.Item>*/}
                {/*<SkeletonPlaceholder.Item alignSelf="flex-end" marginLeft={10} marginBottom={10}>*/}
                {/*    <SkeletonPlaceholder.Item*/}
                {/*        width={width * 0.75}*/}
                {/*        height={80}*/}
                {/*        borderRadius={15}*/}
                {/*        marginBottom={6}*/}
                {/*    />*/}
                {/*</SkeletonPlaceholder.Item>*/}

                {/*<SkeletonPlaceholder.Item alignSelf="flex-start" flexDirection={'row'} gap={10} marginRight={10} marginBottom={10}>*/}
                {/*    <SkeletonPlaceholder.Item*/}
                {/*        width={30}*/}
                {/*        height={30}*/}
                {/*        borderRadius={30}*/}
                {/*        marginBottom={6}*/}
                {/*    />*/}
                {/*    <SkeletonPlaceholder.Item*/}
                {/*        width={70}*/}
                {/*        height={25}*/}
                {/*        borderRadius={30}*/}
                {/*        marginBottom={6}*/}
                {/*        alignSelf={'center'}*/}
                {/*    />*/}
                {/*</SkeletonPlaceholder.Item>*/}
                {/*<SkeletonPlaceholder.Item alignSelf="flex-start" marginBottom={10}>*/}
                {/*    <SkeletonPlaceholder.Item*/}
                {/*        width={width * 0.75}*/}
                {/*        height={100}*/}
                {/*        borderRadius={15}*/}
                {/*        marginBottom={6}*/}
                {/*    />*/}
                {/*</SkeletonPlaceholder.Item>*/}
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
}
