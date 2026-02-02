// Z-Index Hierarchy for Modals
// Use these constants to maintain consistent layering

export const Z_INDEX = {
    // Base layers
    BASE: 'z-0',
    CONTENT: 'z-10',

    // Modal layers (in order of priority)
    MODAL_BACKDROP: 'z-40',           // Standard modal backdrop
    MODAL_CONTENT: 'z-40',            // Standard modal content

    TUTORIAL_MODAL: 'z-45',           // Tutorial (important but dismissible)

    INTERACTION_MODAL: 'z-50',        // NPC interactions
    SHOP_MODAL: 'z-50',               // Shop
    ALLIANCE_MODAL: 'z-50',           // Alliance management
    EVENT_MODAL: 'z-50',              // Random events

    // Critical modals (highest priority)
    BIG_PHONE_MODAL: 'z-[60]',        // Big Phone - HIGHEST PRIORITY

    // Overlays
    LOADING_OVERLAY: 'z-[70]',        // Loading screens (if needed)
    ERROR_OVERLAY: 'z-[80]',          // Critical errors (if needed)
};

// Helper function to get z-index class
export const getModalZIndex = (modalType) => {
    return Z_INDEX[modalType] || Z_INDEX.MODAL_CONTENT;
};
