import mongoose, {Document, models, Schema} from "mongoose";

export interface ICountry extends Document {
    name: string;
    regions: mongoose.Types.ObjectId[];
}

const CountrySchema = new Schema<ICountry>(
    {
        name: {type: String, required: true, unique: true},
        regions: [{type: Schema.Types.ObjectId, ref: "Region"}],
    },
    {timestamps: true}
);

const Country = models.Country || mongoose.model<ICountry>("Country", CountrySchema);
export default Country;
