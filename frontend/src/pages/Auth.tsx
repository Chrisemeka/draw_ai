import { WandSparkles, Sparkles, Chromium, Palette } from "lucide-react"

const apiUrl = import.meta.env.VITE_API_URL

export default function Auth() {
    return(
        <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100">
            <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] max-w-xl space-y-6 sm:space-y-8 bg-[#fcfdff] rounded-xl p-6 sm:p-8 shadow-[0_0_30px_#155dfc66]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#155dfc] to-[#6a11cb] flex items-center justify-center shadow-[0_0_30px_#155dfc80]">
                    <div className="bg-white w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl">
                        <WandSparkles className="text-[#155dfc] w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-lg sm:text-xl font-normal text-gray-700 mb-2">Draw Assistant AI</h1>
                    <p className="text-sm sm:text-base text-gray-600">Your intelligent whiteboard companion</p>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 border border-gray-200 rounded-xl bg-[#eef3ff] flex items-center justify-center">
                            <WandSparkles className="text-[#155dfc] w-5 h-5"/>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">AI-powered element manipulation</p>
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 border border-gray-200 rounded-xl bg-[#eef3ff] flex items-center justify-center">
                            <Sparkles className="text-[#155dfc] w-5 h-5"/>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">Collaborative whiteboard space</p>
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 border border-gray-200 rounded-xl bg-[#eef3ff] flex items-center justify-center">
                            <Palette className="text-[#155dfc] w-5 h-5"/>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">Smart design suggestions</p>
                    </div>
                </div>

                <a href={`${apiUrl}/auth/google`} className="flex items-center justify-center bg-white border border-gray-300 rounded-lg py-3 shadow-lg hover:bg-gray-50 transition-colors">
                    <Chromium className="w-5 h-5"/>    
                    <span className="ml-3 text-sm sm:text-base text-[#2e394b] font-medium">Continue with Google</span>
                </a>

                <div>
                    <p className="text-xs text-gray-500 text-center leading-relaxed">By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </main>
    )
}