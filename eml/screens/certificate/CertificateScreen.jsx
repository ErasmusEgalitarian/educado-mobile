import React, { useEffect, useState } from 'react';
import {
	View,
	SafeAreaView,
	ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/general/BackButton';
import Text from '../../components/general/Text';
import FilterNavBar from '../../components/explore/FilterNavBar';
import CertificateCard from '../../components/certificate/CertificateCard';
import CertificateEmptyState from '../../components/certificate/CertifateEmptyState';
import { determineCategory } from '../../services/utilityFunctions';
import { fetchCertificates } from '../../api/api';
import { getStudentInfo } from '../../services/StorageService';


/**
 * Profile screen
 * @returns {React.Element} Component for the profile screen
 */
export default function CertificateScreen() {
	// Sets dummy data for courses (will be replaced with data from backend)
	const [certificates, setCertificates] = useState([]);
	// Search text state
	const [searchText, setSearchText] = useState('');
	// Selected category state
	const [selectedCategory, setSelectedCategory] = useState(null);

	const getProfile = async () => {
		try {
			const fetchedProfile = await getStudentInfo();
			if (fetchedProfile !== null) {
				const fetchedCertificates = await fetchCertificates(fetchedProfile._id);
				setCertificates(fetchedCertificates);
			}
		} catch (e) {
			console.log('error', e);
		}
	};

	useEffect(() => {
		getProfile();
	}, []);

	const navigation = useNavigation();

	const filteredCertificates = certificates && certificates.filter((certificate) => {
		// Check if the course title includes the search text
		const titleMatchesSearch = (certificate.courseName || '').toLowerCase().includes(searchText.toLowerCase());
		// Check if the course category matches the selected category (or no category is selected)
		const categoryMatchesFilter = !selectedCategory || determineCategory(certificate.courseCategory) === selectedCategory;
		// Return true if both title and category conditions are met
		return titleMatchesSearch && categoryMatchesFilter;
	});

	const handleFilter = (text) => {
		setSearchText(text);
	};

	const handleCategoryFilter = (category) => {
		//if category label is "all" it will display all certificates, 
		//otherwise it will display certificates with the selected category
		if (category === 'Todos') {
			setSelectedCategory(null); // Set selectedCategory to null to show all items
		} else {
			setSelectedCategory(category); // Set selectedCategory to the selected category label
		}
	};
	const noCertificate = certificates.length === 0;

	if (noCertificate) {
		return (
			<View>
				<CertificateEmptyState />
			</View>
		);
	}
	return (
		<SafeAreaView className='bg-secondary'>
			<View className='h-full'>
				<View className='relative mx-4 mt-12 mb-6'>
					<BackButton onPress={() => navigation.navigate('ProfileHome')} />

					<Text className='w-full text-center text-xl font-sans-bold'>
						Certificados
					</Text>
				</View>
				<FilterNavBar
					searchPlaceholder={'Buscar certificados'}
					onChangeText={(text) => handleFilter(text)}
					onCategoryChange={handleCategoryFilter}
				/>
				<ScrollView showsVerticalScrollIndicator={true}>
					<View className="flex flex-col justify-between items-center mx-4">
						{!noCertificate && filteredCertificates.map((certificate, index) => (
							<CertificateCard key={index} certificate={certificate}/>
						))}
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}