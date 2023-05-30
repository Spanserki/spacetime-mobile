import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import BgLogo from '../assets/bg-logo.svg';
import { api } from '../src/lib/api';

export default function Page() {
  const router = useRouter();
  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/7b4802abdb9c25f71dfa',
  };
  const [request, response, SigInGitHub] = useAuthRequest(
    {
      clientId: 'ba39cd564b2797d340e6',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'spacetime'
      }),
    },
    discovery
  );
  async function handleGitUbAuth(code: string) {
    const response = await api.post('/auth', {
      code
    })
    const token = response.data;
    await SecureStore.setItemAsync('token_client_github_mobile', token)
    router.push('/memories')
  }
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleGitUbAuth(code)
    }
  }, [response]);
  return (
    <View
      className='
      flex-1
      items-center
      px-8
      py-10
     '
    >
      <View
        className='
        flex-1
        items-center
        justify-center
        gap-6
      '
      >
        <BgLogo />
        <View
          className='
          space-y-2
          '
        >
          <Text
            className='
            text-center
            font-title
            text-2xl
            text-gray-50
            leading-tight
          '
          >
            Sua cápsula do tempo
          </Text>
          <Text
            className='
            text-center
            font-body
            text-base
            leading-relaxed
            text-gray-100
          '
          >
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          className='
          rounded-full
          bg-green-500
          px-5
          py-2
        '
          onPress={() => SigInGitHub()}
        >
          <Text
            className='
            font-alt
            text-sm
            uppercase
          '
          >
            Começar a cadastrar
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        className='
        text-center
        font-body
        text-sm
        leading-relaxed
        text-gray-200
      '
      >
        Developed by SS digital agency 🚀
      </Text>
    </View>
  );
}
