import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface CommunityAttributes {
  id?: number;
  subdomain: string;
  template?: string;
  polkadot_reference_id: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

interface CommunityCreationAttributes extends Optional<CommunityAttributes, 'id' | 'template' | 'created_at' | 'updated_at' | 'deleted_at'> {}

class Community extends Model<CommunityAttributes, CommunityCreationAttributes> implements CommunityAttributes {
  public id!: number;
  public subdomain!: string;
  public template!: string;
  public polkadot_reference_id!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date | null;
}

Community.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false
    },
    template: {
      type: DataTypes.TEXT
    },
    polkadot_reference_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'communities',
    timestamps: false,
    underscored: true
  }
);

export default Community;
