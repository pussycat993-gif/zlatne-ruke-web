import {
  Home,
  Search,
  ShoppingBag,
  Bell,
  User,
  Heart,
  Star,
  MessageCircle,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Filter,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Share2,
  Camera,
  Image as ImageIcon,
  Send,
  Eye,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Flower2,
  Package,
  Truck,
  Tag,
  Paintbrush,
  Shield,
  BarChart3,
  Info,
  Quote,
  RefreshCw,
  Sun,
  Moon,
  Menu,
  Clock,
  Calendar,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

// Zlatne Ruke — ikonice preko lucide-react (jedinstven stil na celom sajtu).
// Isti API kao ranije: <Icon name="..." size={..} filled />.
const MAP = {
  home: Home,
  search: Search,
  bag: ShoppingBag,
  bell: Bell,
  user: User,
  heart: Heart,
  star: Star,
  chat: MessageCircle,
  plus: Plus,
  minus: Minus,
  back: ArrowLeft,
  forward: ArrowRight,
  close: X,
  check: Check,
  filter: Filter,
  grid: LayoutGrid,
  list: List,
  edit: Pencil,
  trash: Trash2,
  location: MapPin,
  phone: Phone,
  share: Share2,
  camera: Camera,
  image: ImageIcon,
  send: Send,
  eye: Eye,
  chevron: ChevronRight,
  chevronDown: ChevronDown,
  sparkle: Sparkles,
  flower: Flower2,
  package: Package,
  truck: Truck,
  tag: Tag,
  paint: Paintbrush,
  shield: Shield,
  chart: BarChart3,
  info: Info,
  quote: Quote,
  refresh: RefreshCw,
  sun: Sun,
  moon: Moon,
  menu: Menu,
  clock: Clock,
  calendar: Calendar,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof MAP;

type IconProps = Omit<LucideProps, "ref"> & {
  name: IconName;
  /** Popuni oblik (npr. srce/zvezda) bojom currentColor. */
  filled?: boolean;
};

export function Icon({
  name,
  size = 20,
  filled = false,
  strokeWidth = 1.7,
  ...rest
}: IconProps) {
  const Glyph = MAP[name];
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
      {...rest}
    />
  );
}
