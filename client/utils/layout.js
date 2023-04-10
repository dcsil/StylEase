export const calculateNumCol = (Dimensions, imgWidth) => {
  const { width } = Dimensions.get('window');
  const numColumns = Math.floor(width / imgWidth)
  return numColumns
}