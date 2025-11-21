import { Disease } from '@/types/disease';

export const diseases: Disease[] = [
  {
    id: 'tomato-early-blight',
    name: 'Tomato Early Blight',
    nameKn: 'ಟೊಮೇಟೋ ಆರಂಭಿಕ ರೋಗ',
    scientificName: 'Alternaria solani',
    severity: 'high',
    description: 'Early blight is a common fungal disease that affects tomato plants, causing dark spots on leaves.',
    descriptionKn: 'ಆರಂಭಿಕ ರೋಗವು ಟೊಮೇಟೋ ಗಿಡಗಳ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುವ ಸಾಮಾನ್ಯ ಶಿಲೀಂಧ್ರ ರೋಗವಾಗಿದ್ದು, ಎಲೆಗಳ ಮೇಲೆ ಕಪ್ಪು ಚುಕ್ಕೆಗಳನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.',
    symptoms: [
      'Dark brown spots with concentric rings on leaves',
      'Yellow halo around spots',
      'Leaf yellowing and dropping',
      'Stem lesions'
    ],
    symptomsKn: [
      'ಎಲೆಗಳ ಮೇಲೆ ಸಾಂಕೇತಿಕ ಉಂಗುರಗಳೊಂದಿಗೆ ಗಾಢ ಕಂದು ಚುಕ್ಕೆಗಳು',
      'ಚುಕ್ಕೆಗಳ ಸುತ್ತ ಹಳದಿ ಪ್ರಭಾವಲಯ',
      'ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು ಮತ್ತು ಬೀಳುವುದು',
      'ಕಾಂಡದ ಗಾಯಗಳು'
    ],
    treatments: [
      {
        id: 't1',
        type: 'organic',
        name: 'Neem Oil Spray',
        nameKn: 'ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಣೆ',
        dosage: '2-3 tablespoons per liter of water',
        dosageKn: 'ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2-3 ಟೇಬಲ್ಸ್ಪೂನ್',
        application: 'Spray on affected areas every 7-10 days in the evening',
        applicationKn: 'ಸಂಜೆ ಪ್ರಭಾವಿತ ಪ್ರದೇಶಗಳಲ್ಲಿ ಪ್ರತಿ 7-10 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ',
        preventionTips: [
          'Remove infected leaves immediately',
          'Ensure proper spacing between plants',
          'Avoid overhead watering',
          'Apply mulch to prevent soil splash'
        ],
        preventionTipsKn: [
          'ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತಕ್ಷಣವೇ ತೆಗೆದುಹಾಕಿ',
          'ಸಸ್ಯಗಳ ನಡುವೆ ಸರಿಯಾದ ಅಂತರವನ್ನು ಖಚಿತಪಡಿಸಿ',
          'ಮೇಲ್ಗಡೆ ನೀರಿನ ಸೇಚನವನ್ನು ತಪ್ಪಿಸಿ',
          'ಮಣ್ಣಿನ ಚೆಲ್ಲುವಿಕೆಯನ್ನು ತಡೆಯಲು ಮಲ್ಚ್ ಹಾಕಿ'
        ],
        successRate: 85
      },
      {
        id: 't2',
        type: 'chemical',
        name: 'Mancozeb Fungicide',
        nameKn: 'ಮ್ಯಾಂಕೋಝೆಬ್ ಶಿಲೀಂಧ್ರನಾಶಕ',
        dosage: '2.5g per liter of water',
        dosageKn: 'ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2.5 ಗ್ರಾಂ',
        application: 'Spray thoroughly covering both sides of leaves every 10-14 days',
        applicationKn: 'ಎಲೆಗಳ ಎರಡೂ ಬದಿಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಆವರಿಸಿ ಪ್ರತಿ 10-14 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ',
        preventionTips: [
          'Use resistant varieties when available',
          'Rotate crops annually',
          'Maintain good air circulation',
          'Keep garden tools clean'
        ],
        preventionTipsKn: [
          'ಲಭ್ಯವಿರುವಾಗ ನಿರೋಧಕ ಪ್ರಭೇದಗಳನ್ನು ಬಳಸಿ',
          'ವಾರ್ಷಿಕವಾಗಿ ಬೆಳೆಗಳನ್ನು ಪರ್ಯಾಯವಾಗಿಸಿ',
          'ಉತ್ತಮ ವಾಯು ಪರಿಚಲನೆಯನ್ನು ನಿರ್ವಹಿಸಿ',
          'ತೋಟದ ಉಪಕರಣಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ'
        ],
        successRate: 78
      }
    ]
  },
  {
    id: 'potato-late-blight',
    name: 'Potato Late Blight',
    nameKn: 'ಆಲೂಗಡ್ಡೆ ವಿಳಂಬ ರೋಗ',
    scientificName: 'Phytophthora infestans',
    severity: 'high',
    description: 'Late blight is a devastating disease that can destroy entire potato crops within days.',
    descriptionKn: 'ವಿಳಂಬ ರೋಗವು ದಿನಗಳಲ್ಲಿ ಸಂಪೂರ್ಣ ಆಲೂಗಡ್ಡೆ ಬೆಳೆಗಳನ್ನು ನಾಶಮಾಡಬಲ್ಲ ವಿನಾಶಕಾರಿ ರೋಗವಾಗಿದೆ.',
    symptoms: [
      'Water-soaked lesions on leaves',
      'White fuzzy growth on leaf undersides',
      'Brown rotting of tubers',
      'Rapid plant collapse'
    ],
    symptomsKn: [
      'ಎಲೆಗಳ ಮೇಲೆ ನೀರು ಹೀರಿದಂತಹ ಗಾಯಗಳು',
      'ಎಲೆಗಳ ಕೆಳಭಾಗದಲ್ಲಿ ಬಿಳಿ ಮಸುಕಾದ ಬೆಳವಣಿಗೆ',
      'ಗೆಡ್ಡೆಗಳ ಕಂದು ಕೊಳೆಯುವಿಕೆ',
      'ಸಸ್ಯದ ತ್ವರಿತ ಕುಸಿತ'
    ],
    treatments: [
      {
        id: 't3',
        type: 'organic',
        name: 'Copper Sulfate Solution',
        nameKn: 'ತಾಮ್ರ ಸಲ್ಫೇಟ್ ದ್ರಾವಣ',
        dosage: '5g per liter of water',
        dosageKn: 'ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 5 ಗ್ರಾಂ',
        application: 'Spray preventively before disease appears, repeat every 7 days',
        applicationKn: 'ರೋಗ ಕಾಣಿಸಿಕೊಳ್ಳುವ ಮೊದಲು ತಡೆಗಟ್ಟುವಿಕೆಯಾಗಿ ಸಿಂಪಡಿಸಿ, ಪ್ರತಿ 7 ದಿನಗಳಿಗೊಮ್ಮೆ ಪುನರಾವರ್ತಿಸಿ',
        preventionTips: [
          'Plant resistant varieties',
          'Hill up soil around plants',
          'Remove volunteer potato plants',
          'Destroy infected plant material'
        ],
        preventionTipsKn: [
          'ನಿರೋಧಕ ಪ್ರಭೇದಗಳನ್ನು ನೆಡಿ',
          'ಸಸ್ಯಗಳ ಸುತ್ತ ಮಣ್ಣನ್ನು ಎತ್ತರಿಸಿ',
          'ಸ್ವಯಂಪ್ರೇರಿತ ಆಲೂಗಡ್ಡೆ ಸಸ್ಯಗಳನ್ನು ತೆಗೆದುಹಾಕಿ',
          'ಸೋಂಕಿತ ಸಸ್ಯ ವಸ್ತುಗಳನ್ನು ನಾಶಪಡಿಸಿ'
        ],
        successRate: 80
      }
    ]
  },
  {
    id: 'corn-rust',
    name: 'Corn Common Rust',
    nameKn: 'ಮೆಕ್ಕೆಜೋಳ ಸಾಮಾನ್ಯ ತುಕ್ಕು',
    scientificName: 'Puccinia sorghi',
    severity: 'medium',
    description: 'Common rust is a fungal disease that appears as orange-brown pustules on corn leaves.',
    descriptionKn: 'ಸಾಮಾನ್ಯ ತುಕ್ಕು ಶಿಲೀಂಧ್ರ ರೋಗವಾಗಿದ್ದು, ಮೆಕ್ಕೆಜೋಳದ ಎಲೆಗಳ ಮೇಲೆ ಕಿತ್ತಳೆ-ಕಂದು ಬಾವುಗಳಾಗಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ.',
    symptoms: [
      'Orange-brown pustules on leaves',
      'Yellowing of leaves',
      'Reduced grain quality',
      'Premature leaf death'
    ],
    symptomsKn: [
      'ಎಲೆಗಳ ಮೇಲೆ ಕಿತ್ತಳೆ-ಕಂದು ಬಾವುಗಳು',
      'ಎಲೆಗಳ ಹಳದಿಯಾಗುವಿಕೆ',
      'ಕಡಿಮೆಯಾದ ಧಾನ್ಯದ ಗುಣಮಟ್ಟ',
      'ಅಕಾಲಿಕ ಎಲೆಗಳ ಸಾವು'
    ],
    treatments: [
      {
        id: 't4',
        type: 'organic',
        name: 'Sulfur Dust',
        nameKn: 'ಗಂಧಕ ಧೂಳು',
        dosage: 'Apply 20-30 kg per hectare',
        dosageKn: 'ಪ್ರತಿ ಹೆಕ್ಟೇರಿಗೆ 20-30 ಕೆಜಿ ಅನ್ವಯಿಸಿ',
        application: 'Dust early in the morning when dew is present',
        applicationKn: 'ಇಬ್ಬನಿ ಇರುವಾಗ ಮುಂಜಾನೆ ಧೂಳು ಹಾಕಿ',
        preventionTips: [
          'Plant resistant hybrids',
          'Ensure adequate plant nutrition',
          'Control weeds around field',
          'Monitor weather conditions'
        ],
        preventionTipsKn: [
          'ನಿರೋಧಕ ಸಂಕರಗಳನ್ನು ನೆಡಿ',
          'ಸಾಕಷ್ಟು ಸಸ್ಯ ಪೋಷಣೆಯನ್ನು ಖಚಿತಪಡಿಸಿ',
          'ಹೊಲದ ಸುತ್ತ ಕಳೆಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ',
          'ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ'
        ],
        successRate: 75
      }
    ]
  }
];
