import { useNavigation } from '@react-navigation/native';
import React from 'react';
import BackButton from '../../components/general/BackButton';
import noCertificateImage from '../../assets/images/no-certificates.png';
import { Image, Pressable, Text, View, SafeAreaView } from 'react-native';


export default function CertificateEmptyState() {

	const navigation = useNavigation();
	return (
		<SafeAreaView className='bg-secondary'>
			<View className='h-full flex items-center justify-center'>
				<View className='absolute top-0 left-0 right-0 mx-4 mt-12 mb-6'>
					<BackButton onPress={() => navigation.navigate('ProfileHome')} />

					<Text className='w-full text-center text-xl font-sans-bold'>
							Certificados
					</Text>
				</View>

				
				<View className='px-6 max-h-[347px] flex items-center w-full'>
					<Image className='w-32 h-32'
						source={noCertificateImage}
						alt="No Certificates"
					/>
					<Text className='text-2xl text-center font-montserrat-semi-bold mt-4'>Nenhum certificado disponível :</Text>
					<Text className='text-center text-lg my-4 leading-[22px]'>Você ainda não finalizou um curso. Acesse a página de cursos e continue seus estudos para emitir certificados.</Text>
					<Pressable
						onPress={() => navigation.navigate('Meus cursos')}
						className="w-full flex items-center justify-center rounded-lg bg-primaryCustom p-4 mt-4"
					>
						<Text className="text-projectWhite font-bold text-lg">Ir para meus cursos</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView> );
}