import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Send, Phone, MessageCircle } from 'lucide-react-native';

interface Vehicle {
  id: string;
  title: string;
  price: number;
  make: string;
  model: string;
  year: number;
}

interface Seller {
  id: string;
  name: string;
  phone?: string;
}

interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  seller: Seller;
}

export function ContactModal({ visible, onClose, vehicle, seller }: ContactModalProps) {
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || !senderName.trim() || !senderPhone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Message Sent',
        'Your message has been sent to the seller. They will contact you soon.',
        [{ text: 'OK', onPress: onClose }]
      );
      
      // Reset form
      setMessage('');
      setSenderName('');
      setSenderPhone('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultMessage = `Hi, I'm interested in your ${vehicle.year} ${vehicle.make} ${vehicle.model}. Is it still available?`;

  React.useEffect(() => {
    if (visible && !message) {
      setMessage(defaultMessage);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Contact Seller</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleTitle}>{vehicle.title}</Text>
            <Text style={styles.vehiclePrice}>
              {vehicle.price.toLocaleString('en-US')} USD
            </Text>
            <Text style={styles.sellerName}>Seller: {seller.name}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name *</Text>
              <TextInput
                style={styles.input}
                value={senderName}
                onChangeText={setSenderName}
                placeholder="Enter your name"
                placeholderTextColor="#737373"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Phone *</Text>
              <TextInput
                style={styles.input}
                value={senderPhone}
                onChangeText={setSenderPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#737373"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message here..."
                placeholderTextColor="#737373"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={isLoading}
          >
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </Text>
          </TouchableOpacity>

          {seller.phone && (
            <TouchableOpacity style={styles.callButton} onPress={onClose}>
              <Phone size={20} color="#DC2626" />
              <Text style={styles.callButtonText}>Call Instead</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1c1c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#525353',
    backgroundColor: '#2a2b2b',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#404141',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  vehicleInfo: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404141',
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vehiclePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E5E5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#2a2b2b',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#525353',
    gap: 12,
    backgroundColor: '#2a2b2b',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#737373',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2b2b',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DC2626',
    gap: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});