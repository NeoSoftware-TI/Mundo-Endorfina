import Image from "next/image"
import { Calendar} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ActivityCardProps {
  id_post: string
  imageUrl: string
  distance: number
  title: string
  date: string
  likes: number
}

export default function ActivityCard({
  imageUrl,
  distance,
  title,
  date,
}: ActivityCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-48 w-full">
          <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-black px-2 py-1 text-xs font-semibold text-blue-300">
                {distance} km
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

