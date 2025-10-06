import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const PostProductionContext = createContext();

// 2. Create a custom hook for easy access to the context
export const usePostProduction = () => {
    return useContext(PostProductionContext);
};

// 3. Create the Provider component
export const PostProductionProvider = ({ children }) => {
    const [postProgress, setPostProgress] = useState([
        { stage: "Editing", progress: 75, status: 'in-progress' },
        { stage: "Sound Mixing", progress: 40, status: 'in-progress' },
        { stage: "Color Grading", progress: 10, status: 'pending' },
        { stage: "VFX & Final Review", progress: 25, status: 'at-risk' },
    ]);

    const handleUpdate = (stageName, newProgress, newStatus) => {
        setPostProgress(prev =>
            prev.map(stage =>
                stage.stage === stageName
                    ? { ...stage, progress: newProgress, status: newStatus }
                    : stage
            )
        );
    };

    // 4. The value that will be available to all consuming components
    const value = {
        postProgress,
        handleUpdate,
    };

    return (
        <PostProductionContext.Provider value={value}>
            {children}
        </PostProductionContext.Provider>
    );
};