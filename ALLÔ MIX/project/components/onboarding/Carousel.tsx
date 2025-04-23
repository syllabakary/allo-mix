import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, Animated } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface CarouselProps {
  slides: Slide[];
  onSlideChange: (index: number) => void;
}

export default function Carousel({ slides, onSlideChange }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      onSlideChange(index);
    }
  }).current;
  
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  
  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <View style={styles.slideContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    overflow: 'hidden',
    marginBottom: Layout.spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.h2,
    color: Colors.secondary.main,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});