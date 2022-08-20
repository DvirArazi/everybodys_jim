export interface ServerToClientEvents {
    personalityConnected: (personalityId: string, cardData: CardData | undefined) => void;
    personalityDisconnected: (personalityId: string) => void;
    deleteEntries: (indexes: number[]) => void;
    addEntry: (entry: Entry) => void;
    updateEntry: (currentId: string, newId: string) => void;
    createNewUser: (entries: Entry[]) => void;
    construct: (clientData: ClientData) => void;
    cardUpdatedPts: (personalityId: string,value: CardChange) => void;
    cardUpdatedStp: (value: CardChange) => void;
}

export interface ClientToServerEvents {
    init: (role: Role, entries: Entry[]) => void;
    construct: (role: Role) => void
    createRoom: (callback: (roomcode: string) => void) => void;
    cardUpdatedPts: (value: CardChange) => void;
    cardUpdatedStp: (personalityId: string, value: CardChange) => void;
}

export interface InterServerEvents {
    // ping: () => void;
}

export interface SocketData {
    // name: string;
    // age: number;
}


export type RoleType = "Storyteller" | "Personality";

export type Role =
    { type: "Storyteller",
    } |
    { type: "Personality",
        roomcode: string
    } |
    { type: "NewUser"
    }
;

export type Entry = {
    id: string,
    roomcode: string,
    roleType: RoleType,
};


export type AbilityData = {
    description: string,
    approved: boolean
};
export type GoalData = AbilityData & {score: string};

export type AttributeData = AbilityData | GoalData;

export type Storyteller = {
    id: string,
    connected: boolean,
};

export type Personality = {
    id: string,
    cardData: CardData
    stage: number,
    connected: boolean,
};

export type Room = {
    roomcode: string,
    storyteller: Storyteller,
    personalities: Personality[],
    stage: number,
};

export type CardData = {
    name: string,
    abilities: AbilityData[],
    goals: GoalData[],
}

export type Ps0Data = {
    roomcode: string,
    cardData: CardData | undefined
};

export type St0Data = {
    roomcode: string,
    personalities: {
        id: string,
        cardData: CardData
    }[] | undefined
};

export type ClientData = 
    { type: "St0Data", 
        st0data: St0Data,
    } |
    { type: "Ps0Data",
        ps0data: Ps0Data,
    }
;

export type AttributeType = "ability" | "goal";

export type AttributeChange = 
    { type: "description",
        value: string,
    } |
    { type: "checkbox",
        value: boolean,
    } |
    { type: "score",
        value: string,
    }
;

export type CardChange = 
    { type: "name",
        value: string,
    } |
    { type: "attribute",
        columnI: number,
        attributeI: number,
        attributeChange: AttributeChange,
    }
;