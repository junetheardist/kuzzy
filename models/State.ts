import mongoose, {Document, models, Schema} from "mongoose";

export interface IState extends Document {
    name: string;
    country: mongoose.Types.ObjectId;
    region: mongoose.Types.ObjectId;
    cities: mongoose.Types.ObjectId[];
}

const StateSchema = new Schema<IState>(
    {
        name: {type: String, required: true},
        country: {type: Schema.Types.ObjectId, ref: "Country", required: true},
        region: {type: Schema.Types.ObjectId, ref: "Region", required: true},
        cities: [{type: Schema.Types.ObjectId, ref: "City"}],
    },
    {timestamps: true}
);

const State = models.State || mongoose.model<IState>("State", StateSchema);
export default State;
