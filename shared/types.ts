interface ServerToClientEvents {
    personalityConnected: (personalityId: string) => void;
    personalityDisconnected: (personalityId: string) => void;
    nameUpdatedPts: (personalityId: string, name: string) => void;
    attributeUpdatedPts: (personalityId: string, columnI: number, attributeI: number, value: AttributeChangeType) => void
    attributeUpdatedStp: (columnI: number, attributeI: number, value: AttributeChangeType) => void;
}

interface ClientToServerEvents {
    // init: (param: string, callback: (ClientType)) => void;
    init: (param: string, callback: (clientType: ClientType) => void) => void;
    createRoom: (callback: (roomcode: string) => void) => void;
    nameUpdatedPts: (name: string) => void;
    attributeUpdatedPts: (columnI: number, attributeI: number, value: AttributeChangeType) => void;
    attributeUpdatedStp: (personalityId: string, columnI: number, attributeI: number, value: AttributeChangeType) => void;
}

interface InterServerEvents {
    // ping: () => void;
}

interface SocketData {
    // name: string;
    // age: number;
}

type ClientType = 
    { type: "Storyteller", 
        roomcode: string
    } |
    { type: "Personality"
    } | 
    { type: "new",
    }

type Attribute = {
    description: string,
    approved: boolean
}

type Goal = {
    attribute: Attribute,
    score: number
}

type Personality = {
    id: string,
    name: string,
    abilities: Attribute[],
    goals: Goal[]
}

type Room = {
    roomcode: string,
    storytellerId: string,
    personalities: Personality[]
}

type AttributeType = "ability" | "goal";

type AttributeChangeType = 
    { type: "description"
        value: string
    } |
    { type: "checkbox"
        value: boolean
    } |
    { type: "score"
        value: string
    }
;