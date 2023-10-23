interface IOption {
  optn_id: string;
  name: string;
}
interface IGroup {
  vgrp_id: string;
  name: string;
  options: IOption[]
}
interface IVariantSelected {
  vgrp_id: string;
  optn_id: string;
}
interface IVariant {
  vrnt_id: string
  variant_selecteds: IVariantSelected[]
  price: number
  stock: number
  image_url?: string
}
interface IVariantPayload {
  groups: IGroup[]
  variants: IVariant[]
}

interface IAdvancedVariant extends Omit<IVariant, "vrnt_id"> { }