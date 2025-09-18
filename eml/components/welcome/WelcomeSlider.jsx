import React, { useRef } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Sections from '../../constants/PreviewSections';
import Slick from 'react-native-slick';
import Text from '../general/Text';

export default function WelcomeSlider() {
	const slick = useRef(null);
	const tailwindConfig = require('../../tailwind.config.js');
	const projectColors = tailwindConfig.theme.colors;

	return (
		<Slick
			ref={slick}
			scrollEnabled={true}
			loop={true}
			index={0}
			dotColor={projectColors.projectWhite}
			dotStyle={{ width: 10, height: 10 }}
			activeDotColor={projectColors.primaryCustom}
			activeDotStyle={{ width: 10, height: 10 }}
			height={265}
			showsButtons={true}
			autoplayTimeout={10}
			autoplay={true}
			nextButton={
				<Svg className="h-[25px] w-[25px] mr-4">
					<Path
						d="M8.59003 17.1239L13.17 12.5439L8.59003 7.95385L10 6.54385L16 12.5439L10 18.5439L8.59003 17.1239Z"
						fill={projectColors.projectBlack}
					/>
				</Svg>
			}
			prevButton={
				<Svg className="h-[25px] w-[25px] ml-4">
					<Path
						d="M15.41 17.1239L10.83 12.5439L15.41 7.95385L14 6.54385L8 12.5439L14 18.5439L15.41 17.1239Z"
						fill={projectColors.projectBlack}
					/>
				</Svg>
			}
		>
			{Sections.map((sections, index) => (
				<View key={index} className="relative h-full px-10 items-center">

					<View className="top-0 px-4">
						<Text className="text-center font-sans-bold text-subheading">{sections.title}</Text>
					</View>

					<View className="bottom-0 absolute pb-[27.5%] px-6">
						<Text className="text-center text-body">{sections.description}</Text>
					</View>

				</View>
			))}
		</Slick>
	);
}