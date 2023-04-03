export default interface ToastProps {
  message: string;
  recButtonVisible: boolean;
  onRequestRecommendation: (event: React.MouseEvent<HTMLDivElement>) => void;
}