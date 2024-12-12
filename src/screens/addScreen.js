// src/screens/AddItemScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import { useAuth } from "../context/authContext";

const AddItemScreen = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    description: "",
    category: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const selectImage = async (setImageCallback) => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", selectionLimit: 1 },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorMessage) {
          console.error("ImagePicker Error:", response.errorMessage);
        } else if (response.assets) {
          console.log("Selected Image:", response.assets[0]); // Debug log
          setImageCallback(response.assets[0]);
        }
      }
    );
  };
  

  const uploadImageToCloudinary = async (imageFile) => {
    const data = new FormData();
    data.append("file", {
      uri: imageFile.uri,
      type: imageFile.type,
      name: imageFile.fileName,
    });
    data.append("upload_preset", "product_image_upload");
  
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/da9ezk2tb/image/upload`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Cloudinary Response:", response.data); // Debug log
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error.response?.data || error.message);
      Alert.alert("Upload Failed", "Error uploading image. Please try again.");
      return null;
    }
  };
  
const {user} = useAuth()

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const mainImageUrl = await uploadImageToCloudinary(mainImage);
      const secondaryImageUrls = await Promise.all(
        secondaryImages.map((img) => uploadImageToCloudinary(img))
      );

      if (!mainImageUrl || secondaryImageUrls.includes(null)) {
        Alert.alert("Error", "Image uploads failed.");
        return;
      }

      
      const response = await axios.post("http://192.168.33.101:1000/api/v2/addProduct", {
        email: user.email,
        ...formData,
        mainImageUrl,
        secondaryImageUrls,
      });

      Alert.alert("Success", "Product added successfully!");
      setFormData({ itemName: "", price: "", description: "", category: "" });
      setMainImage(null);
      setSecondaryImages([]);
    } catch (error) {
      console.error("Add Product Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to add product.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>List New Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={formData.itemName}
        onChangeText={(text) => handleInputChange("itemName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={(text) => handleInputChange("price", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => handleInputChange("description", text)}
      />

      <Text>Select Category</Text>
      <Picker
        selectedValue={formData.category}
        onValueChange={(value) => handleInputChange("category", value)}
        style={styles.picker}
      >
        <Picker.Item label="Laptops" value="Laptops" />
        <Picker.Item label="Monitors" value="Monitors" />
        <Picker.Item label="Keyboards" value="Keyboards" />
        <Picker.Item label="Mouse" value="Mouse" />
        <Picker.Item label="Headphones" value="Headphones" />
      </Picker>

      <Text>Upload Main Image</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => selectImage(setMainImage)}
      >
        <Text style={styles.buttonText}>Select Main Image</Text>
      </TouchableOpacity>
      {mainImage && <Image source={{ uri: mainImage.uri }} style={styles.image} />}

      <Text>Upload Secondary Images</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => selectImage((img) => setSecondaryImages([...secondaryImages, img]))}
      >
        <Text style={styles.buttonText}>Select Secondary Image</Text>
      </TouchableOpacity>
      {secondaryImages.map((img, index) => (
        <Image key={index} source={{ uri: img.uri }} style={styles.image} />
      ))}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Item</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  picker: { borderWidth: 1, marginBottom: 10 },
  uploadButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", textAlign: "center" },
  image: { width: 100, height: 100, marginVertical: 10 },
});

export default AddItemScreen;
