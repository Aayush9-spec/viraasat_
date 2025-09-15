import SensoryArchiveGrid from '@/components/marketplace/sensory-archive-grid';

const sensoryItems = [
  {
    id: 'material-1',
    name: 'Woven Silk',
    imageId: 'material-silk',
    audioSrc: '/audio/silk-rustle.mp3',
  },
  {
    id: 'material-2',
    name: 'Hammered Brass',
    imageId: 'material-brass',
    audioSrc: '/audio/brass-ping.mp3',
  },
  {
    id: 'material-3',
    name: 'Wet Clay',
    imageId: 'material-clay',
    audioSrc: '/audio/clay-squish.mp3',
  },
  {
    id: 'material-4',
    name: 'Aged Wood',
    imageId: 'material-wood',
    audioSrc: '/audio/wood-grain.mp3',
  },
   {
    id: 'material-5',
    name: 'Handwoven Wool',
    imageId: 'scrolly-1',
    audioSrc: '/audio/silk-rustle.mp3',
  },
   {
    id: 'material-6',
    name: 'Glazed Ceramic',
    imageId: 'scrolly-3',
    audioSrc: '/audio/brass-ping.mp3',
  },
];

export default function SensoryArchivePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SensoryArchiveGrid items={sensoryItems} />
    </div>
  );
}
