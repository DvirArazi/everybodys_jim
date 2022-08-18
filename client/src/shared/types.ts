export interface ServerToClientEvents {
    personalityConnected: (personalityId: string) => void;
    personalityDisconnected: (personalityId: string) => void;
    cardUpdatedPts: (personalityId: string,value: CardChange) => void
    cardUpdatedStp: (value: CardChange) => void;
}

export interface ClientToServerEvents {
    init: (param: string, entries: Entry[], newGame: boolean, callback: (clientType: NewData, toDeletes: string[]) => void) => void;
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


export type Role = "Storyteller" | "Personality";


export type Entry = {
    id: string,
    role: Role
};


export type Attribute = {
    description: string,
    approved: boolean
};
export type Goal = Attribute & {score: string};

export type AbilityData = { type: "ability" } & Attribute
export type GoalData = { type: "goal" } & Goal;

export type AttributeData = GoalData | AbilityData;


export type Storyteller = {
    id: string,
    connected: boolean,
};

export type Personality = {
    id: string,
    name: string,
    abilities: Attribute[],
    goals: Goal[],
    stage: number,
    connected: boolean,
};

export type Room = {
    roomcode: string,
    storyteller: Storyteller,
    personalities: Personality[],
    stage: number,
};

export type cardData = {
    name: string,
    abilities: AbilityData[],
    goals: GoalData[],
}

export type Ps0Data = cardData | undefined;

export type St0Data = {
    roomcode: string,
    personalities?: ({id: string} & cardData)[],
};

export type NewData = {
    role: Role,
    roomcode: string,
}[];

export type ClientData = 
    { type: "Storyteller", 
        st0data: St0Data,
    } |
    { type: "Personality",
        data: Ps0Data,
    } | 
    { type: "new",
        datas: NewData,
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