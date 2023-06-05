import Icon from '@expo/vector-icons/Feather';
import { Link, useRouter } from 'expo-router';
import { ScrollView, View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BgLogo from '../assets/bg-logo.svg';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { api } from '../src/lib/api';
import decode from 'jwt-decode'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface MemoriesProps {
    id?: string;
    coverUrl: string;
    content: string;
    createdAt: string;
}[]

export default function NewMemorie() {
    const { bottom, top } = useSafeAreaInsets();
    const [memories, setmemories] = useState<MemoriesProps[]>([])
    const router = useRouter();
    async function signOut() {
        await SecureStore.deleteItemAsync('token_client_github_mobile')
        router.push('/')
    }
    async function getCookie() {
        const token = await SecureStore.getItemAsync('token_client_github_mobile')
        if (!!token) {
            const user: any = decode(token)
            const { data } = await api.get(`/memories`, {
                params: { id: user.sub }
            });
            setmemories(data)
        }
    }
    useEffect(() => {
        getCookie();
    }, [])
    return (
        <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}>
            <View className='mt-4 px-8 flex-row items-center justify-between'>
                <BgLogo />
                <TouchableOpacity onPress={signOut} className='h-10 w-10 items-center justify-center rounded-full bg-red-500'>
                    <Icon name='log-out' size={16} color='#000' />
                </TouchableOpacity>
                <View className='flex-row gap-2'>
                    <Link
                        href='/newMemorie'
                        asChild
                    >
                        <TouchableOpacity className='h-10 w-10 items-center justify-center rounded-full bg-green-500'>
                            <Icon name='plus' size={16} color='#000' />
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
            {!!memories ? (
                <View className='mt-6 space-y-10'>
                    {memories.map((item: MemoriesProps) => {
                        return (
                            <View key={item.id} className='space-y-4'>
                                <Text className='font-body text-xs text-gray-100'>
                                    {format(new Date(item.createdAt), "d 'de' LLLL ',' yyyy", { locale: ptBR })}
                                </Text>
                                <View className='space-y-4 px-8'>
                                    <Image
                                        source={{ uri: item.coverUrl }}
                                        alt=''
                                        className='aspect-video w-full rounded-lg'
                                    />
                                    <Text
                                        numberOfLines={3}
                                        className='font-bold text-base leading-relaxed text-gray-100 line-clamp-2'
                                    >
                                        {item.content}
                                    </Text>
                                    <Link
                                        href='/memories'
                                        asChild
                                    >
                                        <TouchableOpacity className='flex-row items-center gap-2'>
                                            <Text className='font-body text-sm text-gray-200'>Ler mais</Text>
                                            <Icon name='arrow-right' size={16} color='#9e9ea8' />
                                        </TouchableOpacity>
                                    </Link>
                                </View>
                            </View>
                        )
                    })}
                </View>
            ) : (
                <View>Carregando...</View>
            )}
        </ScrollView >
    )
}