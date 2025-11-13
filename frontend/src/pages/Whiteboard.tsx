import { useState } from "react";
import { Excalidraw, MainMenu, Sidebar } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { Sparkles, FilePlus, FolderOpen, HardDriveUpload,WandSparkles, Send } from "lucide-react"

interface Scene {
    id: string;
    title: string;
    elements: any[];
}

export default function Whiteboard() {
    const [docked, setDocked] = useState(false);
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
    const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
    const [sceneTitle, setSceneTitle] = useState<string | null>(null);
    const [isModified, setIsModified] = useState(false);
    const [scenesArray, setscenesArray] = useState<Scene[]>([]);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const getSceneElements = () => {
        if (excalidrawAPI) {
            const elements = excalidrawAPI?.getSceneElements();
            return elements; 
        }
    };

    const handleSave = () => {
        let currentSceneElements = getSceneElements();

        if (!currentSceneElements?.length) {
            window.alert("Please add elements to the scene before saving.");
            return;
        }

        if (!activeSceneId && (currentSceneElements?.length ?? 0) > 0) {
            const NewSceneTitle = window.prompt("Please enter a title for the scene");
            if (!NewSceneTitle) {
                return;
            }
            const NewSceneId = crypto.randomUUID();

            const newScene = {
                id: NewSceneId,
                title: NewSceneTitle,
                elements: currentSceneElements,
            };

            const allScenes = JSON.parse(localStorage.getItem('scenes') || '{}');
            allScenes[NewSceneId] = newScene;
            localStorage.setItem('scenes', JSON.stringify(allScenes));

            setActiveSceneId(NewSceneId);
            setSceneTitle(NewSceneTitle);
            setIsModified(false);
        }else{
            const updatedScene = {
                id: activeSceneId,
                title: sceneTitle,
                elements: currentSceneElements,
            };

            const allScenes = JSON.parse(localStorage.getItem('scenes') || '{}');
            allScenes[activeSceneId!] = updatedScene;
            localStorage.setItem('scenes', JSON.stringify(allScenes));
            setIsModified(false);
        }
    }

    const handleOpenFromLibrary = () => {
        let currentSceneElements = getSceneElements();
        
        if (currentSceneElements?.length && !activeSceneId) {
            window.alert("Please save the scene before opening from library.");
            return;
        }

        const scenesObject = JSON.parse(localStorage.getItem('scenes') || '{}');
        const scenesArray = Object.values(scenesObject);

        if (scenesArray.length === 0) {
            window.alert("No scenes found in the library.");
            return;
        }

        setscenesArray(scenesArray as Scene[]);

        setIsLibraryOpen(true);
    }

    const loadScene = (scene: Scene) => {
        excalidrawAPI?.updateScene({
            elements: scene.elements,});
        setActiveSceneId(scene.id);
        setSceneTitle(scene.title);
        setIsModified(false);
    }

    const clearCanvas = () => {
        excalidrawAPI?.updateScene({elements: [],});
        setActiveSceneId(null);
        setSceneTitle(null);
        setIsModified(false);
    }

    const handleNewScence = () => {
        let currentSceneElements = getSceneElements();

        if ((currentSceneElements?.length && !activeSceneId) || isModified) {
            setShowModal(true);
            return;
        }

        clearCanvas();
    }

    const handleDontSave = () => {
        setShowModal(false);
        clearCanvas();
    }

    return(
        <div style={{ height: "100vh", width: "100%" }}>
            {isLibraryOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsLibraryOpen(false)} 
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Open from Library</h2>
                            <button 
                                onClick={() => setIsLibraryOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh]">
                            {scenesArray.map((scene) => (
                                <div 
                                    key={scene.id} 
                                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        activeSceneId === scene.id
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        loadScene(scene);
                                        setIsLibraryOpen(false); 
                                    }}
                                >
                                    <p className="font-medium">{scene.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                    <h3 className="text-xl font-semibold mb-2">Unsaved Changes</h3>
                    <p className="text-gray-600 mb-6">
                    Do you want to save your changes before leaving?
                    </p>
                    <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDontSave}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                    >
                        Don't Save
                    </button>
                    <button
                        onClick={() => {
                            handleSave();
                            setShowModal(false);
                            clearCanvas();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Save
                    </button>
                    </div>
                </div>
                </div>
            )}
            <Excalidraw 
                UIOptions={{
                    dockedSidebarBreakpoint: 768,
                }}
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                onChange={(elements) => {
                    if (activeSceneId && elements.length > 0) {
                        setIsModified(true);
                    }
                }}
            >
                <MainMenu>
                    <MainMenu.Group title="Library (Database)">
                        {/* can add a icon={} for the item */}
                        <MainMenu.Item icon={<FilePlus className="h-4 w-4" />} onSelect={() => handleNewScence()}>
                            New Scene
                        </MainMenu.Item>
                        <MainMenu.Item icon={<FolderOpen className="h-4 w-4" />} onSelect={() => handleOpenFromLibrary()}>
                            Open from Library
                        </MainMenu.Item>
                        <MainMenu.Item icon={<HardDriveUpload className="h-4 w-4" />} onSelect={() => handleSave()}>
                            Save
                        </MainMenu.Item>
                    </MainMenu.Group>

                    <MainMenu.Separator />
    
                    <MainMenu.Group title="File (Local Computer)">
                        <MainMenu.DefaultItems.LoadScene />
                        <MainMenu.DefaultItems.SaveToActiveFile />
                        <MainMenu.DefaultItems.SaveAsImage /> 
                        <MainMenu.DefaultItems.Export />
                    </MainMenu.Group>
                    
                    <MainMenu.Separator />
                    
                    <MainMenu.Group title="AI Assistant">
                        <Sidebar.Trigger name="custom" tab="one">
                            <div className="flex flex-row gap-2 items-center">
                                <Sparkles className="h-4 w-4" />
                                <span>Draw AI Assistant</span>
                            </div>
                        </Sidebar.Trigger>
                    </MainMenu.Group>

                    <MainMenu.Separator />

                    <MainMenu.DefaultItems.ToggleTheme />
                </MainMenu>

                <Sidebar name="custom" docked={docked} onDock={setDocked}>
                    <Sidebar.Header />
                    <Sidebar.Tabs>
                        <Sidebar.Tab tab="one">
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#155dfc] to-[#6a11cb] flex items-center justify-center shadow-lg">
                                            <WandSparkles className="text-white w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-gray-800">Draw Assistant AI</h2>
                                            <p className="text-xs text-gray-500">Ask me anything</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#155dfc] to-[#6a11cb] flex items-center justify-center flex-shrink-0">
                                            <WandSparkles className="text-white w-4 h-4" />
                                        </div>
                                        <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                                            <p className="text-sm text-white">
                                                Hi! I'm your Draw Assistant. I can help you create, modify, and enhance your whiteboard designs. What would you like to create today?
                                            </p>
                                        </div>
                                    </div>

                                    {/* Example User Message */}
                                    {/* <div className="flex gap-2 justify-end">
                                        <div className="bg-[#155dfc] rounded-lg p-3 max-w-[80%]">
                                            <p className="text-sm text-white">
                                                Create a flowchart for user authentication
                                            </p>
                                        </div>
                                    </div> */}

                                    {/* Add more messages here dynamically */}
                                </div>

                                {/* Input Form */}
                                <div className="p-4 border-t border-gray-200">
                                    <form className="flex gap-2" onSubmit={(e) => {
                                        e.preventDefault();
                                        // Handle message submission
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="Type your message..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-[#155dfc] to-[#6a11cb] text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </Sidebar.Tab>
                    </Sidebar.Tabs>
                </Sidebar>
            </Excalidraw>
        </div>
    )
}