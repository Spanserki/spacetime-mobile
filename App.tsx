import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity
} from 'react-native';
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts
} from '@expo-google-fonts/roboto';
import { StatusBar } from 'expo-status-bar';
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';
import blurImg from './assets/luz.png'
import BgLogo from './assets/bg-logo.svg'
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from './src/lib/api';

export default function App() {
  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/7b4802abdb9c25f71dfa',
  };
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  })
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
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      api.post('/auth', {
        code
      }).then(response => {
        const token = response.data;
        SecureStore.setItemAsync('token_client_github_mobile', token)
      })
    }
  }, [response]);
  if (!hasLoadedFonts) {
    return null
  }
  return (
    <ImageBackground
      source={blurImg}
      imageStyle={{ position: 'absolute', left: '-100%' }}
      className='
      bg-gray-900
      flex-1
      items-center
      relative
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
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
