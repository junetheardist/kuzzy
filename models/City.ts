import mongoose, {Document, models, Schema} from "mongoose";

export interface ICity extends Document {
    name: string;
    country: mongoose.Types.ObjectId;
    region: mongoose.Types.ObjectId;
    state: mongoose.Types.ObjectId;
    streets: mongoose.Types.ObjectId[];
}

const CitySchema = new Schema<ICity>(
    {
        name: {type: String, required: true},
        country: {type: Schema.Types.ObjectId, ref: "Country", required: true},
        region: {type: Schema.Types.ObjectId, ref: "Region", required: true},
        state: {type: Schema.Types.ObjectId, ref: "State", required: true},
        streets: [{type: Schema.Types.ObjectId, ref: "Street"}],
    },
    {timestamps: true}
);

const City = models.City || mongoose.model<ICity>("City", CitySchema);
export default City;
