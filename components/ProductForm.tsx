import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Input from './Input';
import Button from './Button';
import StatusDropdown from './StatusDropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { Product, ProductFormData, ValidationErrors } from '../types';

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    imageUri: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        imageUri: initialData.imageUri,
        status: initialData.status,
      });
      setImageError(false);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price.toString()))) {
      newErrors.price = 'Price must be a number';
    } else if (parseFloat(formData.price.toString()) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.imageUri) {
      newErrors.imageUri = 'Product image is required';
    }
    
    // Status validation (optional)
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm() && !isSubmitting && !isLoading) {
      setIsSubmitting(true);
      try {
        await onSubmit({
          ...formData,
          price: parseFloat(formData.price.toString()),
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please grant camera roll permissions to upload images'
      );
      return;
    }

    setImageLoading(true);
    setImageError(false);
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: false,
    });

    setImageLoading(false);

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setFormData({ ...formData, imageUri });
      if (errors.imageUri) {
        setErrors({ ...errors, imageUri: undefined });
      }
    }
  };

  const isButtonDisabled = isSubmitting || isLoading;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={pickImage}
        disabled={isButtonDisabled || imageLoading}
      >
        {imageLoading ? (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.imageText}>Loading image...</Text>
          </View>
        ) : formData.imageUri && !imageError ? (
          <Image 
            source={{ uri: formData.imageUri }}
            style={styles.image}
            onError={() => {
              setImageError(true);
              Alert.alert('Error', 'Failed to load image. Please select another image.');
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="camera" size={40} color="#999" />
            <Text style={styles.imageText}>
              {imageError ? 'Failed to load image. Tap to retry.' : 'Tap to add image'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.imageUri && <Text style={styles.errorText}>{errors.imageUri}</Text>}

      <Input
        label="Product Name"
        value={formData.name}
        onChangeText={(text) => {
          setFormData({ ...formData, name: text });
          if (errors.name) {
            setErrors({ ...errors, name: undefined });
          }
        }}
        placeholder="Enter product name"
        error={errors.name}
        editable={!isButtonDisabled}
      />

      <Input
        label="Price"
        value={formData.price.toString()}
        onChangeText={(text) => {
          setFormData({ ...formData, price: text });
          if (errors.price) {
            setErrors({ ...errors, price: undefined });
          }
        }}
        placeholder="Enter price"
        keyboardType="numeric"
        error={errors.price}
        editable={!isButtonDisabled}
      />

      <StatusDropdown
        label="Product Status"
        value={formData.status || 'active'}
        onSelect={(status) => {
          setFormData({ ...formData, status: status as 'active' | 'sold_out' | 'draft' });
          if (errors.status) {
            setErrors({ ...errors, status: undefined });
          }
        }}
        error={errors.status}
      />

      <Button
        title={initialData ? 'Update Product' : 'Add Product'}
        onPress={handleSubmit}
        loading={isButtonDisabled}
        disabled={isButtonDisabled}
        variant="primary"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imageText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ProductForm;