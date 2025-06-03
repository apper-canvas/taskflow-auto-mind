import { 
  CheckSquare, 
  Sun, 
  Moon, 
  Target, 
  Calendar, 
  BarChart3, 
  AlertTriangle, 
  Home, 
  CheckCircle, 
  Plus, 
  X, 
  List, 
  Clock, 
  Search, 
  Check, 
  Edit, 
  Trash2, 
  Tag, 
  Folder 
} from 'lucide-react'

const icons = {
  CheckSquare,
  Sun,
  Moon,
  Target,
  Calendar,
  BarChart3,
  AlertTriangle,
  Home,
  CheckCircle,
  Plus,
  X,
  List,
  Clock,
  Search,
  Check,
  Edit,
  Trash2,
  Tag,
  Folder
}

const ApperIcon = ({ name, className = "", ...props }) => {
  const IconComponent = icons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  
  return <IconComponent className={className} {...props} />
}

export default ApperIcon