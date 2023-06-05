import { View, Text, Switch, TextInput, ScrollView, Image } from 'react-native'
import BgLogo from '../assets/bg-logo.svg';
import { Link, useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/Feather'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api';

export default function NewMemorie() {
    const router = useRouter();
    const { bottom, top } = useSafeAreaInsets();
    const [preview, setPreview] = useState<String | null>(null)
    const [isPublic, setIsPublic] = useState(false);
    const [content, setContent] = useState('');

    async function onOpenImagePicker() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (result.assets[0]) {
            setPreview(result.assets[0].uri)
        }
        // if (!result.canceled) {
        //     setImage(result.assets[0].uri);
        // }
    }
    async function handleCreateMemory() {
        const token = await SecureStore.getItemAsync('token_client_github_mobile')
        const formData = new FormData();
        formData.append('file', {
            uri: preview,
            name: 'image.jpg',
            type: 'image/jpeg'
        } as any)
        const isPublic = formData.get('isPublic')
        const content = formData.get('content')
        const { data } = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        await api.post('/memories', {
            coverUrl: 'url',
            content,
            isPublic
        })
        router.push('/memories')
    }
    return (
        <ScrollView className='flex-1 px-8' contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}>
            <View className='mt-4 flex-row items-center justify-between'>
                <BgLogo />
                <Link
                    href='/memories'
                    asChild
                >
                    <TouchableOpacity className='h-10 w-10 items-center justify-center rounded-full bg-purple-500'>
                        <Icon name='arrow-left' size={16} color='#fff' />
                    </TouchableOpacity>
                </Link>
            </View>
            <View className='mt-6 space-y-6'>
                <View className='flex-row items-center gap-2'>
                    <Switch
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{ false: '#767577', true: '#372560' }}
                        thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
                    />
                    <Text className='font-bold text-base text-gray-200'>Tonar memória pública</Text>
                </View>
                <TouchableOpacity
                    onPress={onOpenImagePicker}
                    activeOpacity={0.7}
                    className='
                    h-32 
                    items-center 
                    justify-center 
                    rounded-lg 
                    border 
                    border-dashed 
                    border-r-gray-500 
                    bg-black/20'
                >
                    {!!preview ? (
                        <Image source={{ uri: preview }} className='w-full h-full rounded-lg object-cover' />
                    ) : (
                        <View className='flex-row items-center gap-2'>
                            <Icon name='image' color='#fff' />
                            <Text className='font-bold text-sm text-gray-200'>
                                Adicionar foto ou video de capa
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TextInput
                    multiline
                    value={content}
                    onChangeText={setContent}
                    className='p-0 font-bold text-md text-gray-50'
                    placeholderTextColor='#56565a'
                    placeholder='Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre.'
                >
                </TextInput>
                <TouchableOpacity
                    onPress={() => console.log('submit')}
                    activeOpacity={0.7}
                    className=' items-center rounded-full bg-green-500 px-5 py-2'
                >
                    <Text
                        className='font-alt text-sm uppercase'
                    >
                        Salvar
                    </Text>
                </TouchableOpacity>
            </View >
        </ScrollView >
    )
}