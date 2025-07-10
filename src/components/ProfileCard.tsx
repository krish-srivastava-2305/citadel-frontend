import React from 'react';
import { Heart, MessageCircle, Bell, User, Calendar, Search, X } from 'lucide-react';

const ProfilePage = ({ userData, onLike, onDislike }: { userData: any, onLike: () => void, onDislike: () => void }) => {

    const name = userData.name || "Unknown User";
    const age = userData.personal?.age || 21;
    const university = userData.academic?.university || "";
    const degreeProgram = userData.academic?.degreeProgram || "";
    const city = userData.geographic?.city || "";
    const personalityPrompt = userData.profileContent?.personalityPrompts || "";
    const interests = userData.personal?.interests || [];

    const profession = degreeProgram ? `${degreeProgram}` : "Student";
    const location = university ? `${university}${city ? ` • ${city}` : ''}` : city;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getGradientColors = (name: string) => {
        const colors = [
            ['from-purple-500', 'to-pink-500'],
            ['from-blue-500', 'to-cyan-500'],
            ['from-green-500', 'to-teal-500'],
            ['from-orange-500', 'to-red-500'],
            ['from-indigo-500', 'to-purple-500'],
            ['from-pink-500', 'to-rose-500'],
            ['from-cyan-500', 'to-blue-500'],
            ['from-emerald-500', 'to-green-500']
        ];

        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const initials = getInitials(name);
    const [gradientFrom, gradientTo] = getGradientColors(name);

    return (
        <div className="max-w-sm w-full mx-auto bg-black text-white min-h-screen relative overflow-hidden">
            {/* Status bar */}
            <div className="flex justify-between items-center p-4 text-white text-sm font-medium">
                <span>12:45</span>
                <div className="flex space-x-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
            </div>

            {/* Main profile section */}
            <div className="relative pb-32">
                {/* Profile image area */}
                <div className="relative h-[32rem] mb-6">
                    <div className={`w-full h-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute top-0 left-0 w-full h-full opacity-20">
                            <div className="absolute top-4 left-4 w-16 h-16 bg-green-600 rounded-full opacity-50"></div>
                            <div className="absolute top-8 right-8 w-12 h-12 bg-green-500 rounded-full opacity-40"></div>
                            <div className="absolute bottom-16 left-8 w-8 h-8 bg-green-400 rounded-full opacity-30"></div>
                        </div>

                        <div className="text-8xl font-bold text-white/90 z-10">{initials}</div>
                    </div>

                    {/* Friend badge */}
                    <div className="absolute top-[22rem] left-4 bg-white/60 backdrop-blur-sm px-4 py-1 rounded-xl text-black flex items-center space-x-2">
                        {"Friend"}
                    </div>

                    {/* Grid icon */}
                    <div className="absolute top-4 right-16 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-4 h-[1px] bg-white"></div>
                            <div className="w-4 h-[1px] bg-white"></div>
                            <div className="w-4 h-[1px] bg-white"></div>
                        </div>
                    </div>
                </div>

                {/* Profile info */}
                <div className="absolute top-[24rem] left-4 space-y-4 w-full pr-4">
                    <div className="flex items-center justify-between w-full">
                        <div className="w-full">
                            <div className="flex justify-between items-center w-full">
                                <h1 className="text-2xl font-bold">{name}</h1>
                                <div className="bg-white/10 w-[4.5rem] h-16 mx-4 rounded-lg text-center flex flex-col justify-center items-center">
                                    <div className="text-[10px] bg-white text-black w-full rounded-t-lg">Year</div>
                                    <div className="text-[28px] font-bold">{age}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-white text-sm mt-1">
                                <User className="w-4 h-4" />
                                <span>{profession}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white text-sm mt-1">
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-20 left-0 right-0 px-3">
                <div className="flex space-x-3">
                    <button
                        onClick={onDislike}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors py-3 px-2 rounded-2xl font-semibold text-green-500 border border-gray-700"
                    >
                        Dislike
                    </button>
                    <button
                        onClick={onLike}
                        className="flex-1 bg-green-500 hover:bg-green-400 transition-colors py-3 px-2 rounded-2xl font-semibold text-black"
                    >
                        Like
                    </button>
                </div>
            </div>

            {/* Bottom navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-gray-800">
                <div className="flex justify-around py-2">
                    <button className="flex flex-col items-center space-y-1">
                        <Search className="w-6 h-4 text-green-500" />
                        <span className="text-xs text-green-500">Explore</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                        <Calendar className="w-6 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Events</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                        <MessageCircle className="w-6 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Chats</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                        <Bell className="w-6 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Notifications</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                        <User className="w-6 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
