import mongoose, {Document, models, Schema} from "mongoose";

export interface IStreet extends Document {
    name: string;
    country: mongoose.Types.ObjectId;
    region: mongoose.Types.ObjectId;
    state: mongoose.Types.ObjectId;
    city: mongoose.Types.ObjectId;
}

const StreetSchema = new Schema<IStreet>(
    {
        name: {type: String, required: true},
        country: {type: Schema.Types.ObjectId, ref: "Country", required: true},
        region: {type: Schema.Types.ObjectId, ref: "Region", required: true},
        state: {type: Schema.Types.ObjectId, ref: "State", required: true},
        city: {type: Schema.Types.ObjectId, ref: "City", required: true},
    },
    {timestamps: true}
);

const Street = models.Street || mongoose.model<IStreet>("Street", StreetSchema);
export default Street;
