import mongoose, {Document, models, Schema} from "mongoose";

export interface IRegion extends Document {
    name: string;
    country: mongoose.Types.ObjectId;
    states: mongoose.Types.ObjectId[];
}

const RegionSchema = new Schema<IRegion>(
    {
        name: {type: String, required: true},
        country: {type: Schema.Types.ObjectId, ref: "Country", required: true},
        states: [{type: Schema.Types.ObjectId, ref: "State"}],
    },
    {timestamps: true}
);

const Region = models.Region || mongoose.model<IRegion>("Region", RegionSchema);
export default Region;
