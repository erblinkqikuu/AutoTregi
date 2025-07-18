import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { X, ChevronDown, ChevronUp, FileSliders as Sliders, ChevronRight, MapPin, Globe } from 'lucide-react-native';
import { SearchFilters, VehicleCategory, VehicleCondition, FuelType, TransmissionType } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import { MakeModelSelector } from './MakeModelSelector';

interface Country {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  country_id: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onResetFilters: () => void;
}

const { width } = Dimensions.get('window');

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    location: true,
    category: true,
    makeModel: true,
    price: true,
    year: false,
    condition: false,
    specs: false,
    location: false,
  });
  const [showMakeModelSelector, setShowMakeModelSelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Complete city database with exact IDs and names
  const cityDatabase: Record<number, City[]> = {
    // Albania (country_id: 2)
    2: [
      { id: 3, name: 'Tirana', country_id: 2 },
      { id: 39, name: 'Durrës', country_id: 2 },
      { id: 40, name: 'Vlorë', country_id: 2 },
      { id: 41, name: 'Shkodër', country_id: 2 },
      { id: 42, name: 'Elbasan', country_id: 2 },
      { id: 43, name: 'Fier', country_id: 2 },
      { id: 44, name: 'Korçë', country_id: 2 },
      { id: 45, name: 'Berat', country_id: 2 },
      { id: 46, name: 'Gjirokastër', country_id: 2 },
      { id: 47, name: 'Lushnjë', country_id: 2 },
      { id: 48, name: 'Kukës', country_id: 2 },
      { id: 49, name: 'Peshkopi', country_id: 2 },
      { id: 50, name: 'Lezhë', country_id: 2 },
      { id: 51, name: 'Sarandë', country_id: 2 },
      { id: 52, name: 'Pogradec', country_id: 2 },
      { id: 53, name: 'Kavajë', country_id: 2 },
      { id: 55, name: 'Laç', country_id: 2 },
      { id: 56, name: 'Tepelenë', country_id: 2 },
      { id: 57, name: 'Librazhd', country_id: 2 },
      { id: 58, name: 'Bulqizë', country_id: 2 },
      { id: 59, name: 'Fushë-Krujë', country_id: 2 },
      { id: 60, name: 'Delvinë', country_id: 2 },
      { id: 61, name: 'Kamëz', country_id: 2 },
      { id: 62, name: 'Dibër', country_id: 2 },
      { id: 230, name: 'Tropoja', country_id: 2 },
      { id: 266, name: 'Farka', country_id: 2 },
      { id: 267, name: 'Luz i Vogël', country_id: 2 },
      { id: 268, name: 'Luz i Madh', country_id: 2 },
      { id: 269, name: 'Kryezi', country_id: 2 },
      { id: 270, name: 'Ndroq', country_id: 2 },
      { id: 271, name: 'Kamëz', country_id: 2 },
      { id: 272, name: 'Baldushk', country_id: 2 },
      { id: 273, name: 'Pashkashesh', country_id: 2 },
      { id: 274, name: 'Sharrë', country_id: 2 },
      { id: 275, name: 'Tujan', country_id: 2 },
      { id: 276, name: 'Petrelë', country_id: 2 },
      { id: 277, name: 'Kashar', country_id: 2 },
      { id: 278, name: 'Mëzez', country_id: 2 },
      { id: 279, name: 'Paskuqan', country_id: 2 },
      { id: 280, name: 'Vorë', country_id: 2 },
      { id: 281, name: 'Kashar', country_id: 2 },
      { id: 282, name: 'Dajti', country_id: 2 },
      { id: 283, name: 'Dukat', country_id: 2 },
      { id: 284, name: 'Tragjas', country_id: 2 },
      { id: 285, name: 'Radhimë', country_id: 2 },
      { id: 286, name: 'Dhërmi', country_id: 2 },
      { id: 287, name: 'Himarë', country_id: 2 },
      { id: 288, name: 'Kaninë', country_id: 2 },
      { id: 289, name: 'Zvërneci', country_id: 2 },
      { id: 290, name: 'Delvinë', country_id: 2 },
      { id: 291, name: 'Sarandë', country_id: 2 },
      { id: 292, name: 'Sukth', country_id: 2 },
      { id: 293, name: 'Maminas', country_id: 2 },
      { id: 294, name: 'Shënavlash', country_id: 2 },
      { id: 295, name: 'Manzë', country_id: 2 },
      { id: 296, name: 'Hamallaj', country_id: 2 },
      { id: 297, name: 'Lalëzi', country_id: 2 },
      { id: 298, name: 'Xhafzotaj', country_id: 2 },
      { id: 299, name: 'Shijak', country_id: 2 },
      { id: 300, name: 'Krujë', country_id: 2 },
      { id: 301, name: 'Velipojë', country_id: 2 },
      { id: 302, name: 'Shëngjin', country_id: 2 },
      { id: 303, name: 'Ksamil', country_id: 2 },
      { id: 304, name: 'Çukë', country_id: 2 },
      { id: 305, name: 'Xarrë', country_id: 2 },
      { id: 306, name: 'Finiq', country_id: 2 },
      { id: 307, name: 'Konispol', country_id: 2 },
      { id: 308, name: 'Bradashesh', country_id: 2 },
      { id: 310, name: 'Peqin', country_id: 2 },
      { id: 311, name: 'Cërrik', country_id: 2 },
      { id: 312, name: 'Nikël', country_id: 2 },
      { id: 313, name: 'Fushë-Krujë', country_id: 2 },
      { id: 314, name: 'Cudhi', country_id: 2 },
      { id: 315, name: 'Gramëz', country_id: 2 },
      { id: 316, name: 'Ballshi', country_id: 2 },
      { id: 317, name: 'Thethi', country_id: 2 },
      { id: 318, name: 'Valbona', country_id: 2 },
      { id: 319, name: 'Tropojë', country_id: 2 },
      { id: 320, name: 'Lëpushë', country_id: 2 },
      { id: 321, name: 'Gjipe', country_id: 2 },
      { id: 322, name: 'Voskopoja', country_id: 2 },
      { id: 323, name: 'Qeparo', country_id: 2 },
      { id: 324, name: 'Rrajca', country_id: 2 },
      { id: 325, name: 'Lin', country_id: 2 },
    ],
    // Kosovo (country_id: 4)
    4: [
      { id: 4, name: 'Gjakova', country_id: 4 },
      { id: 5, name: 'Ferizaj', country_id: 4 },
      { id: 6, name: 'Gjilan', country_id: 4 },
      { id: 8, name: 'Prishtina', country_id: 4 },
      { id: 10, name: 'Lipjan', country_id: 4 },
      { id: 11, name: 'Prizren', country_id: 4 },
      { id: 12, name: 'Mitrovicë', country_id: 4 },
      { id: 13, name: 'Vushtrri', country_id: 4 },
      { id: 14, name: 'Podujevë', country_id: 4 },
      { id: 15, name: 'Malishevë', country_id: 4 },
      { id: 16, name: 'Rahovec', country_id: 4 },
      { id: 17, name: 'Suharekë', country_id: 4 },
      { id: 18, name: 'Kamenicë', country_id: 4 },
      { id: 19, name: 'Drenas', country_id: 4 },
      { id: 20, name: 'Skenderaj', country_id: 4 },
      { id: 21, name: 'Deçan', country_id: 4 },
      { id: 22, name: 'Istog', country_id: 4 },
      { id: 23, name: 'Dragash', country_id: 4 },
      { id: 24, name: 'Kaçanik', country_id: 4 },
      { id: 25, name: 'Shtime', country_id: 4 },
      { id: 26, name: 'Shtërpcë', country_id: 4 },
      { id: 27, name: 'Obiliq', country_id: 4 },
      { id: 28, name: 'Klina', country_id: 4 },
      { id: 29, name: 'Novobërdë', country_id: 4 },
      { id: 30, name: 'Hani i Elezit', country_id: 4 },
      { id: 31, name: 'Viti', country_id: 4 },
      { id: 32, name: 'Pozheran', country_id: 4 },
      { id: 33, name: 'Kllokot', country_id: 4 },
      { id: 34, name: 'Partesh', country_id: 4 },
      { id: 35, name: 'Tërpezë', country_id: 4 },
      { id: 36, name: 'Bibaj', country_id: 4 },
      { id: 37, name: 'Hajvali', country_id: 4 },
      { id: 38, name: 'Fushë Kosovë', country_id: 4 },
      // ... (continuing with all Kosovo cities)
      { id: 94, name: 'Livoç i Epërm', country_id: 4 },
      { id: 95, name: 'Livoç i Poshtëm', country_id: 4 },
      { id: 96, name: 'Vërbovc', country_id: 4 },
      { id: 97, name: 'Uglar', country_id: 4 },
      { id: 98, name: 'Përlepnicë', country_id: 4 },
      { id: 99, name: 'Cërnicë', country_id: 4 },
      { id: 100, name: 'Zhegër', country_id: 4 },
      { id: 101, name: 'Malishevë e Gjilanit', country_id: 4 },
      { id: 102, name: 'Nasalë', country_id: 4 },
      { id: 103, name: 'Llashticë', country_id: 4 },
      { id: 104, name: 'Kmetoc', country_id: 4 },
      { id: 105, name: 'Cërnillë', country_id: 4 },
      { id: 106, name: 'Velekincë', country_id: 4 },
      { id: 107, name: 'Gadish', country_id: 4 },
      { id: 108, name: 'Kishnapolë', country_id: 4 },
      { id: 109, name: 'Vërban', country_id: 4 },
      { id: 110, name: 'Bresalc', country_id: 4 },
      { id: 111, name: 'Pasjan', country_id: 4 },
      { id: 112, name: 'Drobesh', country_id: 4 },
      { id: 113, name: 'Pogragjë', country_id: 4 },
      { id: 114, name: 'Muçivërcë', country_id: 4 },
      { id: 115, name: 'Shillovë', country_id: 4 },
      { id: 116, name: 'Koretishtë', country_id: 4 },
      { id: 117, name: 'Koretin', country_id: 4 },
      { id: 118, name: 'Topanicë', country_id: 4 },
      { id: 119, name: 'Sojeva', country_id: 4 },
      { id: 120, name: 'Greme', country_id: 4 },
      { id: 121, name: 'Jezerc', country_id: 4 },
      { id: 122, name: 'Burrnik', country_id: 4 },
      { id: 123, name: 'Komogllavë', country_id: 4 },
      { id: 124, name: 'Zaskok', country_id: 4 },
      { id: 125, name: 'Neredime e Epërme', country_id: 4 },
      { id: 126, name: 'Neredime e Poshtme', country_id: 4 },
      { id: 128, name: 'Gaçkë', country_id: 4 },
      { id: 129, name: 'Varosh', country_id: 4 },
      { id: 130, name: 'Mirosalë', country_id: 4 },
      { id: 131, name: 'Balaj', country_id: 4 },
      { id: 132, name: 'Slivovë e Ferizajt', country_id: 4 },
      { id: 133, name: 'Doganaj', country_id: 4 },
      { id: 134, name: 'Sazli', country_id: 4 },
      { id: 135, name: 'Pleshine', country_id: 4 },
      { id: 136, name: 'Veternik', country_id: 4 },
      { id: 137, name: 'Matiçan', country_id: 4 },
      { id: 138, name: 'Kolovicë', country_id: 4 },
      { id: 139, name: 'Germovë', country_id: 4 },
      { id: 140, name: 'Sofali', country_id: 4 },
      { id: 141, name: 'Bardhosh', country_id: 4 },
      { id: 142, name: 'Lebanë', country_id: 4 },
      { id: 143, name: 'Shkabaj', country_id: 4 },
      { id: 144, name: 'Vranidoll', country_id: 4 },
      { id: 145, name: 'Barilevë', country_id: 4 },
      { id: 146, name: 'Slivovë', country_id: 4 },
      { id: 147, name: 'Mramor', country_id: 4 },
      { id: 148, name: 'Miradi e Epërme', country_id: 4 },
      { id: 149, name: 'Miradi e Poshtme', country_id: 4 },
      { id: 150, name: 'Bernicë e Poshtme', country_id: 4 },
      { id: 151, name: 'Bernicë e Epërme', country_id: 4 },
      { id: 152, name: 'Graçanicë', country_id: 4 },
      { id: 153, name: 'Kishnicë', country_id: 4 },
      { id: 154, name: 'Badovc', country_id: 4 },
      { id: 155, name: 'Llapllasellë', country_id: 4 },
      { id: 156, name: 'Keqekollë', country_id: 4 },
      { id: 157, name: 'Llukar', country_id: 4 },
      { id: 158, name: 'Makovc', country_id: 4 },
      { id: 159, name: 'Marec', country_id: 4 },
      { id: 160, name: 'Gllogovicë', country_id: 4 },
      { id: 161, name: 'Germia', country_id: 4 },
      { id: 162, name: 'Sllatina', country_id: 4 },
      { id: 163, name: 'Bajgorë', country_id: 4 },
      { id: 164, name: 'Bare', country_id: 4 },
      { id: 165, name: 'Maxherë', country_id: 4 },
      { id: 166, name: 'Rahovë', country_id: 4 },
      { id: 167, name: 'Shupkovc', country_id: 4 },
      { id: 168, name: 'Frashër', country_id: 4 },
      { id: 169, name: 'Shipol', country_id: 4 },
      { id: 170, name: 'Gushavc', country_id: 4 },
      { id: 171, name: 'Kçiq i Madh', country_id: 4 },
      { id: 172, name: 'Kçiq i Vogël', country_id: 4 },
      { id: 173, name: 'Zhabar', country_id: 4 },
      { id: 174, name: 'Suhodoll i Poshtëm', country_id: 4 },
      { id: 175, name: 'Suhodoll i Epërm', country_id: 4 },
      { id: 176, name: 'Vinarc i Poshtëm', country_id: 4 },
      { id: 177, name: 'Vinarc i Epërm', country_id: 4 },
      { id: 178, name: 'Zasellë', country_id: 4 },
      { id: 179, name: 'Zvecan', country_id: 4 },
      { id: 180, name: 'Skenderaj', country_id: 4 },
      { id: 181, name: 'Trepça', country_id: 4 },
      { id: 182, name: 'Ceceli', country_id: 4 },
      { id: 183, name: 'Stanoc i Poshtëm', country_id: 4 },
      { id: 184, name: 'Stanoc i Epërm', country_id: 4 },
      { id: 185, name: 'Dumnicë e Poshtme', country_id: 4 },
      { id: 186, name: 'Dumnicë e Epërme', country_id: 4 },
      { id: 187, name: 'Banjska', country_id: 4 },
      { id: 188, name: 'Pantinë', country_id: 4 },
      { id: 189, name: 'Maxhunaj', country_id: 4 },
      { id: 190, name: 'Studime e Poshtme', country_id: 4 },
      { id: 191, name: 'Pestovë', country_id: 4 },
      { id: 192, name: 'Tarazhë', country_id: 4 },
      { id: 193, name: 'Bukosh', country_id: 4 },
      { id: 194, name: 'Mihaliq', country_id: 4 },
      { id: 195, name: 'Gllavotin', country_id: 4 },
      { id: 196, name: 'Oshlan', country_id: 4 },
      { id: 197, name: 'Zhilivodë', country_id: 4 },
      { id: 198, name: 'Zhabar', country_id: 4 },
      { id: 199, name: 'Galicë', country_id: 4 },
      { id: 200, name: 'Samadrexhë', country_id: 4 },
      { id: 201, name: 'Studime e Epërme', country_id: 4 },
      { id: 202, name: 'Gojbulë', country_id: 4 },
      { id: 203, name: 'Druar', country_id: 4 },
      { id: 204, name: 'Akrashticë', country_id: 4 },
      { id: 205, name: 'Beçuk', country_id: 4 },
      { id: 206, name: 'Zym', country_id: 4 },
      { id: 207, name: 'Romajë', country_id: 4 },
      { id: 208, name: 'Vërmicë', country_id: 4 },
      { id: 209, name: 'Shkrel', country_id: 4 },
      { id: 210, name: 'Kushnin', country_id: 4 },
      { id: 211, name: 'Reçan', country_id: 4 },
      { id: 212, name: 'Lubinjë e Poshtme', country_id: 4 },
      { id: 213, name: 'Lubinjë e Epërme', country_id: 4 },
      { id: 214, name: 'Planejë', country_id: 4 },
      { id: 215, name: 'Nashec', country_id: 4 },
      { id: 216, name: 'Jabllanicë', country_id: 4 },
      { id: 217, name: 'Randobravë', country_id: 4 },
      { id: 218, name: 'Korishë', country_id: 4 },
      { id: 219, name: 'Atmaxhë', country_id: 4 },
      { id: 220, name: 'Poslisht', country_id: 4 },
      { id: 221, name: 'Petrovë', country_id: 4 },
      { id: 222, name: 'Gjonaj', country_id: 4 },
      { id: 223, name: 'Mazrek', country_id: 4 },
      { id: 224, name: 'Landovica', country_id: 4 },
      { id: 225, name: 'Suharekë', country_id: 4 },
      { id: 226, name: 'Dragash', country_id: 4 },
      { id: 227, name: 'Mamusha', country_id: 4 },
      { id: 228, name: 'Rahovec', country_id: 4 },
      { id: 229, name: 'Has', country_id: 4 },
      { id: 231, name: 'Deqani', country_id: 4 },
      { id: 232, name: 'Brekoc', country_id: 4 },
      { id: 233, name: 'Mejë', country_id: 4 },
      { id: 234, name: 'Moglicë', country_id: 4 },
      { id: 235, name: 'Korenicë', country_id: 4 },
      { id: 236, name: 'Gërçinë', country_id: 4 },
      { id: 237, name: 'Ponoshec', country_id: 4 },
      { id: 238, name: 'Smolicë', country_id: 4 },
      { id: 239, name: 'Bardhasan', country_id: 4 },
      { id: 240, name: 'Bec', country_id: 4 },
      { id: 241, name: 'Hereç', country_id: 4 },
      { id: 242, name: 'Dujakë', country_id: 4 },
      { id: 243, name: 'Cërmjan', country_id: 4 },
      { id: 244, name: 'Çerkezë', country_id: 4 },
      { id: 245, name: 'Marmullë', country_id: 4 },
      { id: 246, name: 'Rakoc', country_id: 4 },
      { id: 247, name: 'Trakaniq', country_id: 4 },
      { id: 248, name: 'Junik', country_id: 4 },
      { id: 249, name: 'Botushë', country_id: 4 },
      { id: 250, name: 'Stubëll', country_id: 4 },
      { id: 251, name: 'Radavc', country_id: 4 },
      { id: 252, name: 'Drenovc', country_id: 4 },
      { id: 253, name: 'Kalabri', country_id: 4 },
      { id: 254, name: 'Rugova', country_id: 4 },
      { id: 255, name: 'Brezovica', country_id: 4 },
      { id: 256, name: 'Kuqishtë', country_id: 4 },
      { id: 257, name: 'Brod', country_id: 4 },
      { id: 258, name: 'Lumbardh', country_id: 4 },
      { id: 259, name: 'Drelaj', country_id: 4 },
      { id: 260, name: 'Llaushë', country_id: 4 },
      { id: 261, name: 'Banjë', country_id: 4 },
      { id: 262, name: 'Vrellë', country_id: 4 },
      { id: 263, name: 'Drenaj', country_id: 4 },
      { id: 264, name: 'Klinë', country_id: 4 },
      { id: 265, name: 'Istogu', country_id: 4 },
      { id: 309, name: 'Librazhd', country_id: 4 },
    ],
    // North Macedonia (country_id: 5)
    5: [
      { id: 63, name: 'Tetovë', country_id: 5 },
      { id: 64, name: 'Shkup', country_id: 5 },
      { id: 65, name: 'Gostivar', country_id: 5 },
      { id: 66, name: 'Kumanovë', country_id: 5 },
      { id: 67, name: 'Prilep', country_id: 5 },
      { id: 68, name: 'Bitola (Manastiri)', country_id: 5 },
      { id: 69, name: 'Ohër', country_id: 5 },
      { id: 70, name: 'Strugë', country_id: 5 },
      { id: 71, name: 'Kërçovë', country_id: 5 },
      { id: 72, name: 'Çair', country_id: 5 },
      { id: 73, name: 'Saraj', country_id: 5 },
      { id: 74, name: 'Debresh', country_id: 5 },
      { id: 75, name: 'Slupçan', country_id: 5 },
      { id: 76, name: 'Poroj', country_id: 5 },
      { id: 77, name: 'Vrapçisht', country_id: 5 },
      { id: 78, name: 'Shtip', country_id: 5 },
    ],
    // Montenegro (country_id: 6)
    6: [
      { id: 80, name: 'Ulqin', country_id: 6 },
      { id: 81, name: 'Tuz', country_id: 6 },
      { id: 82, name: 'Plavë', country_id: 6 },
      { id: 83, name: 'Gucia', country_id: 6 },
      { id: 84, name: 'Rozhajë', country_id: 6 },
      { id: 85, name: 'Bijello Pole', country_id: 6 },
      { id: 86, name: 'Kraja', country_id: 6 },
      { id: 87, name: 'Malësia e Madhe', country_id: 6 },
      { id: 88, name: 'Shtoji', country_id: 6 },
      { id: 89, name: 'Skje', country_id: 6 },
      { id: 90, name: 'Vuthaj', country_id: 6 },
      { id: 91, name: 'Dinoshë', country_id: 6 },
      { id: 92, name: 'Martinaj', country_id: 6 },
      { id: 93, name: 'Tivar', country_id: 6 },
    ],
  };

  const countries: Country[] = [
    { id: 2, name: 'Albania' },
    { id: 4, name: 'Kosovo' },
    { id: 5, name: 'North Macedonia' },
    { id: 6, name: 'Montenegro' },
  ];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setShowMakeModelSelector(false);
    }
  }, [visible]);

  const fetchCities = async (countryId: number) => {
    // Use local city database instead of API call
    setLoadingCities(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const countryCities = cityDatabase[countryId] || [];
      setCities(countryCities);
      setLoadingCities(false);
    }, 300);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCountrySelect = (country: Country) => {
    if (selectedCountry?.id === country.id) {
      // Deselect country
      setSelectedCountry(null);
      setSelectedCity(null);
      setCities([]);
      updateFilter('countryId', undefined);
      updateFilter('cityId', undefined);
    } else {
      // Select new country
      setSelectedCountry(country);
      setSelectedCity(null); // Reset city when country changes
      setCities([]); // Clear cities
      fetchCities(country.id);
      
      // Set country filter using ID
      updateFilter('countryId', country.id);
      updateFilter('cityId', undefined); // Clear city filter
    }
  };

  const handleCitySelect = (city: City) => {
    if (selectedCity?.id === city.id) {
      // Deselect city, revert to country-only filter
      setSelectedCity(null);
      updateFilter('cityId', undefined);
      // Keep country filter active
    } else {
      // Select new city
      setSelectedCity(city);
      
      // Set city filter using ID
      updateFilter('cityId', city.id);
    }
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {};
    setLocalFilters(resetFilters);
    setSelectedCountry(null);
    setSelectedCity(null);
    setCities([]);
    onResetFilters();
  };

  const handleClose = () => {
    // Ensure make model selector is closed first
    if (showMakeModelSelector) {
      setShowMakeModelSelector(false);
      // Small delay to ensure proper cleanup
      setTimeout(() => {
        onClose();
      }, 150);
    } else {
      onClose();
    }
  };

  const handleMakeModelSelectorOpen = () => {
    console.log('Opening Make Model Selector');
    setShowMakeModelSelector(true);
  };

  const handleMakeModelSelectorClose = () => {
    console.log('Closing Make Model Selector');
    setShowMakeModelSelector(false);
  };

  const handleMakeSelect = (make: string) => {
    updateFilter('make', make);
    // Clear model when make changes
    if (localFilters.model) {
      updateFilter('model', undefined);
    }
  };

  const handleModelSelect = (model: string) => {
    updateFilter('model', model);
  };

  const categories: { key: VehicleCategory; label: string }[] = [
    { key: 'car', label: t('cars') },
    { key: 'motorcycle', label: t('motorcycles') },
    { key: 'truck', label: t('trucks') },
    { key: 'large-vehicle', label: t('largeVehicles') },
  ];

  const conditions: { key: VehicleCondition; label: string }[] = [
    { key: 'new', label: t('new') },
    { key: 'used', label: t('used') },
    { key: 'damaged', label: t('damaged') },
  ];

  const fuelTypes: { key: FuelType; label: string }[] = [
    { key: 'gasoline', label: t('gasoline') },
    { key: 'diesel', label: t('diesel') },
    { key: 'electric', label: t('electric') },
    { key: 'hybrid', label: t('hybrid') },
    { key: 'lpg', label: t('lpg') },
    { key: 'cng', label: t('cng') },
  ];

  const transmissionTypes: { key: TransmissionType; label: string }[] = [
    { key: 'manual', label: t('manual') },
    { key: 'automatic', label: t('automatic') },
    { key: 'cvt', label: t('cvt') },
  ];

  const renderSection = (
    title: string,
    sectionKey: string,
    content: React.ReactNode
  ) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>
      {expandedSections[sectionKey] && (
        <View style={styles.sectionContent}>{content}</View>
      )}
    </View>
  );

  const renderMultiSelect = (
    options: { key: string; label: string }[],
    selectedValue: string | undefined,
    onSelect: (value: string | undefined) => void
  ) => (
    <View style={styles.multiSelectContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.multiSelectOption,
            selectedValue === option.key && styles.multiSelectOptionActive,
          ]}
          onPress={() => onSelect(selectedValue === option.key ? undefined : option.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.multiSelectOptionText,
              selectedValue === option.key && styles.multiSelectOptionTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMakeModelSelector = () => (
    <View style={styles.makeModelContainer}>
      <TouchableOpacity
        style={styles.makeModelButton}
        onPress={handleMakeModelSelectorOpen}
        activeOpacity={0.7}
      >
        <View style={styles.makeModelContent}>
          <View style={styles.makeModelInfo}>
            <Text style={styles.makeModelLabel}>Make & Model</Text>
            <Text style={styles.makeModelValue}>
              {localFilters.make && localFilters.model
                ? `${localFilters.make} ${localFilters.model}`
                : localFilters.make
                ? localFilters.make
                : 'Select make and model'}
            </Text>
          </View>
          <ChevronRight size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>
      
      {(localFilters.make || localFilters.model) && (
        <View style={styles.selectedMakeModel}>
          {localFilters.make && (
            <View style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{localFilters.make}</Text>
              <TouchableOpacity
                onPress={() => {
                  updateFilter('make', undefined);
                  updateFilter('model', undefined);
                }}
                activeOpacity={0.7}
              >
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
          {localFilters.model && (
            <View style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{localFilters.model}</Text>
              <TouchableOpacity
                onPress={() => updateFilter('model', undefined)}
                activeOpacity={0.7}
              >
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderPriceRange = () => (
    <View style={styles.priceContainer}>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Min {t('price')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.minPrice?.toString() || ''}
          onChangeText={(text) => updateFilter('minPrice', text ? parseInt(text) : undefined)}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.currencyLabel}>{t('currency')}</Text>
      </View>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Max {t('price')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.maxPrice?.toString() || ''}
          onChangeText={(text) => updateFilter('maxPrice', text ? parseInt(text) : undefined)}
          placeholder="∞"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.currencyLabel}>{t('currency')}</Text>
      </View>
    </View>
  );

  const renderYearRange = () => (
    <View style={styles.priceContainer}>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Min {t('year')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.minYear?.toString() || ''}
          onChangeText={(text) => updateFilter('minYear', text ? parseInt(text) : undefined)}
          placeholder="1990"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Max {t('year')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.maxYear?.toString() || ''}
          onChangeText={(text) => updateFilter('maxYear', text ? parseInt(text) : undefined)}
          placeholder="2024"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );

  const renderMileageRange = () => (
    <View style={styles.priceContainer}>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Min {t('mileage')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.minMileage?.toString() || ''}
          onChangeText={(text) => updateFilter('minMileage', text ? parseInt(text) : undefined)}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.currencyLabel}>km</Text>
      </View>
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceLabel}>Max {t('mileage')}</Text>
        <TextInput
          style={styles.priceInput}
          value={localFilters.maxMileage?.toString() || ''}
          onChangeText={(text) => updateFilter('maxMileage', text ? parseInt(text) : undefined)}
          placeholder="∞"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.currencyLabel}>km</Text>
      </View>
    </View>
  );

  const renderCountrySelector = () => (
    <View style={styles.locationSelectorContainer}>
      <View style={styles.selectorGroup}>
        <Text style={styles.selectorLabel}>Country</Text>
        <View style={styles.selectorGrid}>
          {countries.map((country) => (
            <TouchableOpacity
              key={country.id}
              style={[
                styles.selectorOption,
                selectedCountry?.id === country.id && styles.selectorOptionActive,
              ]}
              onPress={() => handleCountrySelect(country)}
              activeOpacity={0.7}
            >
              <Globe size={16} color={selectedCountry?.id === country.id ? '#FFFFFF' : '#A3A3A3'} />
              <Text
                style={[
                  styles.selectorOptionText,
                  selectedCountry?.id === country.id && styles.selectorOptionTextActive,
                ]}
              >
                {country.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedCountry && (
        <View style={styles.selectorGroup}>
          <View style={styles.cityHeader}>
            <Text style={styles.selectorLabel}>City</Text>
            {loadingCities && (
              <ActivityIndicator size="small" color="#EF4444" />
            )}
          </View>
          
          {loadingCities ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading cities...</Text>
            </View>
          ) : cities.length > 0 ? (
            <ScrollView 
              style={styles.citiesScrollContainer}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <View style={styles.selectorGrid}>
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    style={[
                      styles.selectorOption,
                      selectedCity?.id === city.id && styles.selectorOptionActive,
                    ]}
                    onPress={() => handleCitySelect(city)}
                    activeOpacity={0.7}
                  >
                    <MapPin size={16} color={selectedCity?.id === city.id ? '#FFFFFF' : '#A3A3A3'} />
                    <Text
                      style={[
                        styles.selectorOptionText,
                        selectedCity?.id === city.id && styles.selectorOptionTextActive,
                      ]}
                    >
                      {city.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No cities available</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => value !== undefined && value !== '').length;
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Sliders size={24} color="#EF4444" />
              <Text style={styles.headerTitle}>Filters</Text>
              {getActiveFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {renderSection('Location', 'location', renderCountrySelector())}

            {renderSection(
              'Category',
              'category',
              renderMultiSelect(categories, localFilters.category, (value) =>
                updateFilter('category', value as VehicleCategory)
              )
            )}

            {renderSection('Make & Model', 'makeModel', renderMakeModelSelector())}

            {renderSection(`${t('price')} Range`, 'price', renderPriceRange())}

            {renderSection(`${t('year')} Range`, 'year', renderYearRange())}

            {renderSection(
              t('condition'),
              'condition',
              renderMultiSelect(conditions, localFilters.condition, (value) =>
                updateFilter('condition', value as VehicleCondition)
              )
            )}

            {renderSection('Vehicle Specifications', 'specs', (
              <View>
                <View style={styles.specSection}>
                  <Text style={styles.specTitle}>{t('fuelType')}</Text>
                  {renderMultiSelect(fuelTypes, localFilters.fuelType, (value) =>
                    updateFilter('fuelType', value as FuelType)
                  )}
                </View>
                <View style={styles.specSection}>
                  <Text style={styles.specTitle}>{t('transmission')}</Text>
                  {renderMultiSelect(transmissionTypes, localFilters.transmission, (value) =>
                    updateFilter('transmission', value as TransmissionType)
                  )}
                </View>
                <View style={styles.specSection}>
                  <Text style={styles.specTitle}>{t('mileage')} Range</Text>
                  {renderMileageRange()}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.7}>
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.7}>
              <Text style={styles.applyButtonText}>
                Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MakeModelSelector
        visible={showMakeModelSelector}
        onClose={handleMakeModelSelectorClose}
        selectedMake={localFilters.make}
        selectedModel={localFilters.model}
        onMakeSelect={handleMakeSelect}
        onModelSelect={handleModelSelect}
      />
    </>
  );
};

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
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#2a2b2b',
    borderBottomWidth: 1,
    borderBottomColor: '#525353',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#2a2b2b',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404141',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  multiSelectOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
  },
  multiSelectOptionActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  multiSelectOptionText: {
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  multiSelectOptionTextActive: {
    color: '#FFFFFF',
  },
  makeModelContainer: {
    marginTop: 12,
  },
  makeModelButton: {
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
  },
  makeModelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  makeModelInfo: {
    flex: 1,
  },
  makeModelLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A3A3A3',
    marginBottom: 4,
  },
  makeModelValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedMakeModel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7F1D1D',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  selectedItemText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A3A3A3',
    marginBottom: 8,
  },
  priceInput: {
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  currencyLabel: {
    fontSize: 12,
    color: '#A3A3A3',
    textAlign: 'center',
    marginTop: 4,
  },
  specSection: {
    marginBottom: 20,
  },
  specTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A3A3A3',
    marginBottom: 8,
  },
  locationSelectorContainer: {
    marginTop: 12,
    gap: 20,
  },
  selectorGroup: {
    gap: 12,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    gap: 6,
    minWidth: 100,
  },
  selectorOptionActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  selectorOptionText: {
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  selectorOptionTextActive: {
    color: '#FFFFFF',
  },
  citiesScrollContainer: {
    maxHeight: 200,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#A3A3A3',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#404141',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#A3A3A3',
    fontStyle: 'italic',
  },
  locationContainer: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A3A3A3',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#404141',
    borderWidth: 1,
    borderColor: '#525353',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#2a2b2b',
    borderTopWidth: 1,
    borderTopColor: '#525353',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#404141',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#525353',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});