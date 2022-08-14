interface ServerToClientEvents {
    personalityConnected: (personalityId: string) => void;
    nameUpdatedPts: (personalityId: string, name: string) => void;
    attributeUpdatedPts: (personalityId: string, columnI: number, attributeI: number, value: GoalChangeType) => void
}

interface ClientToServerEvents {
    clientType: (roomcode: string, callback: (clientType: ClientType) => void) => void;
    createRoom: (callback: (roomcode: string) => void) => void;
    nameUpdatedPts: (name: string) => void;
    attributeUpdatedPts: (columnI: number, attributeI: number, value: GoalChangeType) => void
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

type ClientType = 
    { type: "Storyteller", 
        roomcode: string
    } |
    { type: "Personality"
        roomFound: boolean
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

type GoalChangeType = 
    { type: "description"
        value: string
    } |
    { type: "checkbox"
        value: boolean
    } |
    { type: "score"
        value: number
    }
;